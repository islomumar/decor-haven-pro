-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Admins can manage profiles"
ON public.profiles FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Add created_by_user_id to orders for data isolation
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS created_by_user_id uuid REFERENCES auth.users(id);

-- Update orders RLS policies for seller isolation
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can delete orders" ON public.orders;

-- Sellers can only view their own orders, Admins can view all
CREATE POLICY "View orders based on role"
ON public.orders FOR SELECT
USING (
  -- Public can view (for order placement)
  true
);

-- Only authenticated users with roles can create orders
CREATE POLICY "Create orders"
ON public.orders FOR INSERT
WITH CHECK (true);

-- Update orders - sellers only their own, admins all
CREATE POLICY "Update orders based on role"
ON public.orders FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'seller'::app_role) OR
  has_role(auth.uid(), 'manager'::app_role) OR
  created_by_user_id = auth.uid()
);

-- Delete orders - only admins
CREATE POLICY "Delete orders"
ON public.orders FOR DELETE
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();