-- Add indexes for better query performance on large datasets
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON public.products(sort_order);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_products_active_category ON public.products(is_active, category_id);
CREATE INDEX IF NOT EXISTS idx_products_active_featured ON public.products(is_active, is_featured);

-- Full text search index for product names
CREATE INDEX IF NOT EXISTS idx_products_name_uz_gin ON public.products USING gin(to_tsvector('simple', name_uz));
CREATE INDEX IF NOT EXISTS idx_products_name_ru_gin ON public.products USING gin(to_tsvector('simple', name_ru));

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order);