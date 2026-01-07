-- Drop the overly permissive policy that allows anyone to view customers
DROP POLICY IF EXISTS "Anyone can view customers" ON public.customers;

-- Create a new policy that restricts SELECT access to admin, manager, and seller roles only
CREATE POLICY "Authenticated staff can view customers" 
ON public.customers 
FOR SELECT 
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'seller'::app_role)
);