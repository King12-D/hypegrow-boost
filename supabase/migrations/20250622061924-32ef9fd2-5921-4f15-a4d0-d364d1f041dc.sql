
-- First, let's see the current users to get your user ID
-- (This is just a query to see available users)
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Then we'll insert the admin role for the most recent user (assuming that's you)
-- Replace this with your actual user ID once we see it
INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'uchennadavid660@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
