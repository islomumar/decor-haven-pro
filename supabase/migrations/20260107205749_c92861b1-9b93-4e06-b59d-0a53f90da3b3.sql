-- =============================================
-- 1. FIX ORDERS TABLE - Restrict SELECT to staff roles
-- =============================================

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "View orders based on role" ON public.orders;

-- Create new SELECT policy - only staff can view orders
CREATE POLICY "Staff can view orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'seller'::app_role) OR
  created_by_user_id = auth.uid()
);

-- =============================================
-- 2. FIX ORDER_ITEMS TABLE - Restrict all operations
-- =============================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can view order_items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can create order_items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can delete order_items" ON public.order_items;

-- SELECT - only staff can view order items
CREATE POLICY "Staff can view order_items" 
ON public.order_items 
FOR SELECT 
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'seller'::app_role)
);

-- INSERT - public can create order items (needed for order form)
CREATE POLICY "Public can create order_items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);

-- DELETE - only admin can delete order items
CREATE POLICY "Admin can delete order_items" 
ON public.order_items 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- 3. FIX SETTINGS TABLE - Admin only for write operations
-- =============================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert settings" ON public.settings;
DROP POLICY IF EXISTS "Anyone can update settings" ON public.settings;
DROP POLICY IF EXISTS "Anyone can view settings" ON public.settings;

-- SELECT - only admin can view settings (contains sensitive data like telegram tokens)
CREATE POLICY "Admin can view settings" 
ON public.settings 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- INSERT - only admin can insert settings
CREATE POLICY "Admin can insert settings" 
ON public.settings 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- UPDATE - only admin can update settings
CREATE POLICY "Admin can update settings" 
ON public.settings 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));