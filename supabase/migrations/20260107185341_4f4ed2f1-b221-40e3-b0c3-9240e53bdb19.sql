-- Add SEO fields to categories table
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS meta_title_uz text,
ADD COLUMN IF NOT EXISTS meta_title_ru text,
ADD COLUMN IF NOT EXISTS meta_description_uz text,
ADD COLUMN IF NOT EXISTS meta_description_ru text,
ADD COLUMN IF NOT EXISTS meta_keywords text,
ADD COLUMN IF NOT EXISTS is_indexed boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS is_followed boolean DEFAULT true;

-- Add unique constraint on slug to prevent duplicates
ALTER TABLE public.categories
ADD CONSTRAINT categories_slug_unique UNIQUE (slug);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- Create index on is_active for sitemap queries
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);