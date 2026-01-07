-- Relax orders INSERT policy to accept phones 12-15 characters (to handle edge cases)
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;

CREATE POLICY "Public can create orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'new'
  AND customer_name IS NOT NULL
  AND length(btrim(customer_name)) >= 2
  AND customer_phone IS NOT NULL
  AND customer_phone LIKE '+998%'
  AND length(customer_phone) >= 12
  AND length(customer_phone) <= 15
  AND (customer_message IS NULL OR length(customer_message) <= 2000)
  AND (total_price IS NULL OR total_price >= 0)
);