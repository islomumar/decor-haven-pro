-- Add favicon, short description, and social links to system_settings
ALTER TABLE public.system_settings 
ADD COLUMN IF NOT EXISTS favicon_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS short_description_uz TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS short_description_ru TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS social_facebook TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS social_instagram TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS social_telegram TEXT DEFAULT NULL;