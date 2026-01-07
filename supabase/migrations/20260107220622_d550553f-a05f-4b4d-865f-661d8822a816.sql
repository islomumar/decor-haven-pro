-- Fix checkout insertion errors by allowing guest (anon) inserts for order flow

-- ORDERS: allow anon + authenticated to insert
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'orders'
      AND policyname = 'Create orders'
  ) THEN
    EXECUTE 'DROP POLICY "Create orders" ON public.orders';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'orders'
      AND policyname = 'Public can create orders'
  ) THEN
    EXECUTE 'DROP POLICY "Public can create orders" ON public.orders';
  END IF;
END $$;

CREATE POLICY "Public can create orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- CUSTOMERS: allow anon + authenticated to insert
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'customers'
      AND policyname = 'Public can create customers for orders'
  ) THEN
    EXECUTE 'DROP POLICY "Public can create customers for orders" ON public.customers';
  END IF;
END $$;

CREATE POLICY "Public can create customers for orders"
ON public.customers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ORDER_ITEMS: allow anon + authenticated to insert
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'order_items'
      AND policyname = 'Public can create order_items'
  ) THEN
    EXECUTE 'DROP POLICY "Public can create order_items" ON public.order_items';
  END IF;
END $$;

CREATE POLICY "Public can create order_items"
ON public.order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
