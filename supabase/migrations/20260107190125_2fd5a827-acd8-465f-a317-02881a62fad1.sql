-- Add SEO fields to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS meta_title_uz text,
ADD COLUMN IF NOT EXISTS meta_title_ru text,
ADD COLUMN IF NOT EXISTS meta_description_uz text,
ADD COLUMN IF NOT EXISTS meta_description_ru text,
ADD COLUMN IF NOT EXISTS meta_keywords text,
ADD COLUMN IF NOT EXISTS is_indexed boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS is_followed boolean DEFAULT true;

-- Add unique constraint on slug
ALTER TABLE public.products
ADD CONSTRAINT products_slug_unique UNIQUE (slug);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- Create index for featured and active products
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured, is_active);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for product images
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role) 
    OR public.has_role(auth.uid(), 'editor'::public.app_role)
  )
);

CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role) 
    OR public.has_role(auth.uid(), 'editor'::public.app_role)
  )
);

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role) 
    OR public.has_role(auth.uid(), 'editor'::public.app_role)
  )
);