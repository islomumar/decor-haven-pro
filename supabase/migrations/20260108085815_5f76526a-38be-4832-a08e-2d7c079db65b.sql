-- Customers jadvalini tuzatish - faqat xodimlar ko'ra olsin
DROP POLICY IF EXISTS "Public can create customers for orders" ON public.customers;
DROP POLICY IF EXISTS "Authenticated staff can view customers" ON public.customers;
DROP POLICY IF EXISTS "Admins can manage customers" ON public.customers;

CREATE POLICY "Staff can view customers" 
ON public.customers 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'manager'::app_role) OR public.has_role(auth.uid(), 'seller'::app_role));

CREATE POLICY "Public can create customers" 
ON public.customers 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  phone IS NOT NULL AND 
  phone LIKE '+998%' AND 
  length(btrim(phone)) >= 9 AND 
  length(btrim(phone)) <= 20
);

CREATE POLICY "Admins can manage customers" 
ON public.customers 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'editor'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'editor'::app_role));

-- Orders jadvalini tuzatish
DROP POLICY IF EXISTS "Staff can view orders" ON public.orders;
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
DROP POLICY IF EXISTS "Update orders based on role" ON public.orders;
DROP POLICY IF EXISTS "Delete orders" ON public.orders;

CREATE POLICY "Staff can view orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'manager'::app_role) OR public.has_role(auth.uid(), 'seller'::app_role) OR created_by_user_id = auth.uid());

CREATE POLICY "Public can create orders" 
ON public.orders 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  status = 'new' AND 
  customer_name IS NOT NULL AND 
  length(btrim(customer_name)) >= 2 AND 
  customer_phone IS NOT NULL AND 
  customer_phone LIKE '+998%'
);

CREATE POLICY "Staff can update orders" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'seller'::app_role) OR public.has_role(auth.uid(), 'manager'::app_role) OR created_by_user_id = auth.uid());

CREATE POLICY "Admin can delete orders" 
ON public.orders 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Order_items jadvalini tuzatish
DROP POLICY IF EXISTS "Staff can view order_items" ON public.order_items;
DROP POLICY IF EXISTS "Public can create order_items" ON public.order_items;
DROP POLICY IF EXISTS "Admin can delete order_items" ON public.order_items;

CREATE POLICY "Staff can view order_items" 
ON public.order_items 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'manager'::app_role) OR public.has_role(auth.uid(), 'seller'::app_role));

CREATE POLICY "Public can create order_items" 
ON public.order_items 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  quantity >= 1 AND 
  quantity <= 100 AND 
  length(btrim(product_id)) > 0 AND 
  length(btrim(product_name_snapshot)) > 0
);

CREATE POLICY "Admin can delete order_items" 
ON public.order_items 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));