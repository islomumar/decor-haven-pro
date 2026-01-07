-- Tighten public INSERT policies to avoid overly-permissive WITH CHECK (true)

-- ORDERS: guest insert must include minimally valid contact info; status must be 'new'
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
CREATE POLICY "Public can create orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'new'
  AND customer_name IS NOT NULL
  AND length(btrim(customer_name)) BETWEEN 2 AND 100
  AND customer_phone IS NOT NULL
  AND customer_phone LIKE '+998%'
  AND length(btrim(customer_phone)) BETWEEN 9 AND 20
  AND (customer_message IS NULL OR length(customer_message) <= 1000)
  AND (total_price IS NULL OR total_price >= 0)
);

-- CUSTOMERS: guest insert must include a valid-ish phone; optional name
DROP POLICY IF EXISTS "Public can create customers for orders" ON public.customers;
CREATE POLICY "Public can create customers for orders"
ON public.customers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  phone IS NOT NULL
  AND phone LIKE '+998%'
  AND length(btrim(phone)) BETWEEN 9 AND 20
  AND (name IS NULL OR length(btrim(name)) BETWEEN 2 AND 100)
  AND (notes IS NULL OR length(notes) <= 1000)
);

-- ORDER_ITEMS: guest insert must include safe quantities and non-empty snapshots
DROP POLICY IF EXISTS "Public can create order_items" ON public.order_items;
CREATE POLICY "Public can create order_items"
ON public.order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (
  quantity >= 1 AND quantity <= 100
  AND length(btrim(product_id)) > 0
  AND length(btrim(product_name_snapshot)) > 0
  AND (price_snapshot IS NULL OR price_snapshot >= 0)
);
