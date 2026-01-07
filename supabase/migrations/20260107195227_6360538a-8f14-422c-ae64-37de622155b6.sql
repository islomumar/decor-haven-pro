-- Add primary_domain field to system_settings
ALTER TABLE public.system_settings 
ADD COLUMN IF NOT EXISTS primary_domain TEXT DEFAULT NULL;

-- Update RLS to allow insert for admins as well (for first-time setup)
DROP POLICY IF EXISTS "Anyone can insert system settings" ON public.system_settings;
CREATE POLICY "Admins can insert system settings"
ON public.system_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));