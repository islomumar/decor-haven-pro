-- Create app_role enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

-- Create user_roles table for admin access control
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_uz TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image TEXT,
    icon TEXT DEFAULT 'Package',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Create products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_uz TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    description_uz TEXT,
    description_ru TEXT,
    full_description_uz TEXT,
    full_description_ru TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    price NUMERIC,
    original_price NUMERIC,
    images TEXT[] DEFAULT '{}',
    materials TEXT[] DEFAULT '{}',
    sizes TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    is_negotiable BOOLEAN DEFAULT false,
    in_stock BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
ON public.products FOR SELECT USING (true);

CREATE POLICY "Admins can manage products"
ON public.products FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Create customers table
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL UNIQUE,
    name TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view customers"
ON public.customers FOR SELECT USING (true);

CREATE POLICY "Anyone can create customers"
ON public.customers FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage customers"
ON public.customers FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Create site_content table for inline editable content
CREATE TABLE public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value_uz TEXT,
    value_ru TEXT,
    content_type TEXT DEFAULT 'text', -- text, html, image
    page TEXT, -- homepage, about, contact, footer
    section TEXT, -- hero, benefits, promo, etc.
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site content"
ON public.site_content FOR SELECT USING (true);

CREATE POLICY "Admins can manage site content"
ON public.site_content FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Create system_settings table for site configuration
CREATE TABLE public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT DEFAULT 'Mebel Store',
    logo_url TEXT,
    contact_phone TEXT,
    whatsapp_number TEXT,
    working_hours_uz TEXT,
    working_hours_ru TEXT,
    address_uz TEXT,
    address_ru TEXT,
    seo_title TEXT,
    seo_description TEXT,
    default_language TEXT DEFAULT 'uz',
    languages_enabled TEXT[] DEFAULT ARRAY['uz', 'ru'],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view system settings"
ON public.system_settings FOR SELECT USING (true);

CREATE POLICY "Admins can manage system settings"
ON public.system_settings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add customer_id to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id);

-- Insert default system settings
INSERT INTO public.system_settings (
    site_name, 
    contact_phone, 
    whatsapp_number,
    working_hours_uz,
    working_hours_ru,
    address_uz,
    address_ru,
    default_language
) VALUES (
    'Mebel Store',
    '+998 90 123 45 67',
    '+998901234567',
    'Du-Ju: 9:00 - 18:00, Sha: 10:00 - 16:00',
    'Пн-Пт: 9:00 - 18:00, Сб: 10:00 - 16:00',
    'Toshkent sh., Chilonzor tumani, Bunyodkor ko''chasi, 15-uy',
    'г. Ташкент, Чиланзарский район, ул. Бунёдкор, дом 15',
    'uz'
);

-- Insert default site content
INSERT INTO public.site_content (key, value_uz, value_ru, page, section) VALUES
('hero_title', 'Uyingiz uchun mukammal mebel', 'Идеальная мебель для вашего дома', 'homepage', 'hero'),
('hero_subtitle', 'Yuqori sifatli mebel ishlab chiqarish va sotish. Sizning orzuingizdagi uyni yaratamiz.', 'Производство и продажа высококачественной мебели. Создаем дом вашей мечты.', 'homepage', 'hero'),
('hero_cta', 'Katalogni ko''rish', 'Смотреть каталог', 'homepage', 'hero'),
('promo_title', 'Maxsus taklif!', 'Специальное предложение!', 'homepage', 'promo'),
('promo_subtitle', 'Barcha mebellarga 20% chegirma', 'Скидка 20% на всю мебель', 'homepage', 'promo'),
('about_story', 'Bizning tarix', 'Наша история', 'about', 'story'),
('about_story_text', '2013 yildan beri biz Toshkentda eng yaxshi mebel ishlab chiqaruvchilardan birimiz.', 'С 2013 года мы являемся одним из лучших производителей мебели в Ташкенте.', 'about', 'story'),
('footer_description', 'Yuqori sifatli mebel ishlab chiqarish va sotish. 10 yildan ortiq tajriba.', 'Производство и продажа высококачественной мебели. Более 10 лет опыта.', 'footer', 'main');

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();