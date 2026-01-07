-- =============================================
-- FIX THEMES TABLE - Restrict INSERT/UPDATE to admin only
-- =============================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert themes" ON public.themes;
DROP POLICY IF EXISTS "Anyone can update themes" ON public.themes;

-- INSERT - only admin can insert themes
CREATE POLICY "Admin can insert themes" 
ON public.themes 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- UPDATE - only admin can update themes
CREATE POLICY "Admin can update themes" 
ON public.themes 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));