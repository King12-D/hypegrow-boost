
-- Add more social media platforms and services
INSERT INTO public.service_packages (platform, service_type, package_name, quantity, price, is_popular, is_active) VALUES
-- Facebook
('Facebook', 'Followers', 'Starter Pack', 1000, 2500, false, true),
('Facebook', 'Followers', 'Growth Pack', 5000, 10000, true, true),
('Facebook', 'Followers', 'Pro Pack', 10000, 18000, false, true),
('Facebook', 'Likes', 'Basic', 500, 1500, false, true),
('Facebook', 'Likes', 'Standard', 2000, 5000, true, true),
('Facebook', 'Likes', 'Premium', 5000, 10000, false, true),

-- Twitter/X
('Twitter', 'Followers', 'Starter', 1000, 3000, false, true),
('Twitter', 'Followers', 'Growth', 5000, 12000, true, true),
('Twitter', 'Followers', 'Elite', 10000, 20000, false, true),
('Twitter', 'Likes', 'Basic', 500, 1200, false, true),
('Twitter', 'Retweets', 'Standard', 1000, 2500, true, true),

-- LinkedIn
('LinkedIn', 'Connections', 'Professional', 500, 5000, false, true),
('LinkedIn', 'Connections', 'Business', 1000, 8500, true, true),
('LinkedIn', 'Followers', 'Corporate', 2000, 15000, false, true),
('LinkedIn', 'Likes', 'Engagement', 1000, 3000, false, true),

-- Snapchat
('Snapchat', 'Followers', 'Basic', 1000, 2800, false, true),
('Snapchat', 'Views', 'Story Boost', 5000, 4000, true, true),

-- Telegram
('Telegram', 'Members', 'Channel Growth', 1000, 3500, false, true),
('Telegram', 'Views', 'Post Boost', 10000, 2500, true, true);

-- Create notifications table for real-time updates
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create discount codes table
CREATE TABLE public.discount_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER NOT NULL,
  discount_amount NUMERIC,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_discounts junction table
CREATE TABLE public.order_discounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders NOT NULL,
  discount_code_id UUID REFERENCES public.discount_codes NOT NULL,
  discount_amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system settings table
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, description) VALUES
('payment_methods', '["bank_transfer", "paystack", "wallet"]', 'Available payment methods'),
('auto_approval_threshold', '5000', 'Auto-approve payments below this amount in Naira'),
('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
('welcome_bonus', '1000', 'Welcome bonus for new users in Naira');

-- Create support tickets table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'medium',
  assigned_to UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for support tickets
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS policies for support tickets
CREATE POLICY "Users can view their own tickets" 
  ON public.support_tickets 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tickets" 
  ON public.support_tickets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets" 
  ON public.support_tickets 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create analytics table for tracking
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable realtime for key tables
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.payments REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create function to automatically create notifications
CREATE OR REPLACE FUNCTION public.create_order_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify user when order status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.user_id,
      'Order Status Updated',
      'Your order #' || SUBSTRING(NEW.id::text, 1, 8) || ' status changed to ' || NEW.status,
      CASE 
        WHEN NEW.status = 'completed' THEN 'success'
        WHEN NEW.status = 'cancelled' THEN 'error'
        ELSE 'info'
      END
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order notifications
CREATE TRIGGER order_status_notification
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.create_order_notification();

-- Create function to update discount code usage
CREATE OR REPLACE FUNCTION public.increment_discount_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.discount_codes
  SET current_uses = current_uses + 1
  WHERE id = NEW.discount_code_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for discount usage
CREATE TRIGGER increment_discount_usage_trigger
  AFTER INSERT ON public.order_discounts
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_discount_usage();
