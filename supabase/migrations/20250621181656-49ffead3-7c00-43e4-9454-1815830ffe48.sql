
-- Create orders table to track all social media service orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  platform TEXT NOT NULL,
  service_type TEXT NOT NULL,
  package_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  amount NUMERIC NOT NULL,
  username TEXT NOT NULL,
  post_link TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table to track payment records
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer',
  bank_reference TEXT,
  payment_proof_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create service_packages table for managing pricing and packages
CREATE TABLE public.service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  service_type TEXT NOT NULL,
  package_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create payments" ON public.payments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for service_packages (public read access)
CREATE POLICY "Anyone can view active service packages" ON public.service_packages
  FOR SELECT USING (is_active = true);

-- Insert sample service packages
INSERT INTO public.service_packages (platform, service_type, package_name, quantity, price, is_popular) VALUES
-- Instagram packages
('Instagram', 'Followers', '100 Followers', 100, 500, false),
('Instagram', 'Followers', '500 Followers', 500, 2000, true),
('Instagram', 'Followers', '1,000 Followers', 1000, 3500, false),
('Instagram', 'Followers', '5,000 Followers', 5000, 15000, false),
('Instagram', 'Likes', '100 Likes', 100, 300, false),
('Instagram', 'Likes', '500 Likes', 500, 1200, true),
('Instagram', 'Likes', '1,000 Likes', 1000, 2000, false),
('Instagram', 'Likes', '5,000 Likes', 5000, 8000, false),
('Instagram', 'Comments', '10 Comments', 10, 400, false),
('Instagram', 'Comments', '25 Comments', 25, 800, true),
('Instagram', 'Comments', '50 Comments', 50, 1500, false),
('Instagram', 'Comments', '100 Comments', 100, 2800, false),

-- TikTok packages
('TikTok', 'Followers', '100 Followers', 100, 600, false),
('TikTok', 'Followers', '500 Followers', 500, 2500, true),
('TikTok', 'Followers', '1,000 Followers', 1000, 4000, false),
('TikTok', 'Followers', '5,000 Followers', 5000, 18000, false),
('TikTok', 'Views', '1,000 Views', 1000, 200, false),
('TikTok', 'Views', '10,000 Views', 10000, 1500, true),
('TikTok', 'Views', '50,000 Views', 50000, 6000, false),
('TikTok', 'Views', '100,000 Views', 100000, 10000, false),
('TikTok', 'Likes', '100 Likes', 100, 400, false),
('TikTok', 'Likes', '500 Likes', 500, 1500, true),
('TikTok', 'Likes', '1,000 Likes', 1000, 2500, false),
('TikTok', 'Likes', '5,000 Likes', 5000, 10000, false),

-- YouTube packages
('YouTube', 'Subscribers', '100 Subscribers', 100, 800, false),
('YouTube', 'Subscribers', '500 Subscribers', 500, 3500, true),
('YouTube', 'Subscribers', '1,000 Subscribers', 1000, 6500, false),
('YouTube', 'Subscribers', '5,000 Subscribers', 5000, 30000, false),
('YouTube', 'Views', '1,000 Views', 1000, 300, false),
('YouTube', 'Views', '10,000 Views', 10000, 2500, true),
('YouTube', 'Views', '50,000 Views', 50000, 10000, false),
('YouTube', 'Views', '100,000 Views', 100000, 18000, false),
('YouTube', 'Watch Hours', '100 Hours', 100, 1500, false),
('YouTube', 'Watch Hours', '500 Hours', 500, 6000, true),
('YouTube', 'Watch Hours', '1,000 Hours', 1000, 10000, false),
('YouTube', 'Watch Hours', '4,000 Hours', 4000, 35000, false),

-- WhatsApp packages
('WhatsApp', 'Status Views', '500 Views', 500, 400, false),
('WhatsApp', 'Status Views', '1,000 Views', 1000, 700, true),
('WhatsApp', 'Status Views', '5,000 Views', 5000, 3000, false),
('WhatsApp', 'Status Views', '10,000 Views', 10000, 5500, false),
('WhatsApp', 'Bulk Posting', '50 Groups', 50, 1000, false),
('WhatsApp', 'Bulk Posting', '100 Groups', 100, 1800, true),
('WhatsApp', 'Bulk Posting', '250 Groups', 250, 4000, false),
('WhatsApp', 'Bulk Posting', '500 Groups', 500, 7500, false);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_packages_updated_at BEFORE UPDATE ON public.service_packages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
