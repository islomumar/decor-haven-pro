import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingBag, MessageCircle, Phone, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/ProductCard';
import { ImageLightbox } from '@/components/ImageLightbox';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import { useProductById, useProducts, useCategories, Product } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';

export default function ProductDetails() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { addItem, isInCart } = useCart();
  const { isAdmin } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Fetch product from database by ID or slug
  const { product, loading, error } = useProductById(id || '');
  const { categories } = useCategories();
  
  // Fetch related products by category
  const { products: relatedProducts } = useProducts(1, {
    categoryId: product?.category_id || undefined,
    isActive: true,
  }, 5);

  // Filter out current product from related
  const filteredRelated = relatedProducts.filter(p => p.id !== product?.id).slice(0, 4);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize('');
    setSelectedColor('');
  }, [product?.id]);

  if (loading) {
    return (
      <div id="hero" className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div id="hero" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === 'uz' ? 'Mahsulot topilmadi' : 'Товар не найден'}
          </h1>
          {isAdmin && (
            <p className="text-muted-foreground mb-4 text-sm">
              Debug: ID = {id}
            </p>
          )}
          <Button asChild>
            <Link to="/catalog">
              {language === 'uz' ? 'Katalogga qaytish' : 'Вернуться в каталог'}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get localized content with fallback
  const name = (language === 'uz' ? product.name_uz : product.name_ru) || product.name_uz || product.name_ru;
  const description = (language === 'uz' ? product.description_uz : product.description_ru) || product.description_uz || product.description_ru;
  const fullDescription = (language === 'uz' ? product.full_description_uz : product.full_description_ru) || product.full_description_uz || product.full_description_ru;
  
  const formatPrice = (price: number) => price.toLocaleString('uz-UZ');
  const inCart = isInCart(product.id);
  const images = product.images || [];
  const materials = product.materials || [];
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const price = product.price || 0;

  // Get category name
  const category = categories.find(c => c.id === product.category_id);
  const categoryName = category 
    ? (language === 'uz' ? category.name_uz : category.name_ru)
    : (product.category_id || '—');

  const whatsappMessage = encodeURIComponent(
    `Assalomu alaykum! Men "${name}" mahsulotiga qiziqyapman.\n\nNarxi: ${formatPrice(price)} so'm\n\nBatafsil ma'lumot berishingizni so'rayman.`
  );

  return (
    <div id="hero" className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Button asChild variant="ghost" className="mb-6 gap-2">
          <Link to="/catalog"><ArrowLeft className="w-4 h-4" /> {t.common.back}</Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div 
              className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4 cursor-zoom-in"
              onClick={() => images.length > 0 && setLightboxOpen(true)}
            >
              {images.length > 0 ? (
                <img
                  src={images[selectedImage] || images[0]}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  {language === 'uz' ? 'Rasm mavjud emas' : 'Нет изображения'}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Image Lightbox */}
            <ImageLightbox
              images={images}
              initialIndex={selectedImage}
              isOpen={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
            />
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.in_stock ? (
                <span className="text-sm text-green-600 font-medium">{t.products.inStock}</span>
              ) : (
                <span className="text-sm text-destructive font-medium">{t.products.outOfStock}</span>
              )}
            </div>

            <h1 className="font-serif text-3xl font-bold mb-4">{name}</h1>
            {description && <p className="text-muted-foreground mb-6">{description}</p>}

            <div className="flex items-baseline gap-3 mb-6">
              {price > 0 ? (
                <>
                  <span className="font-serif text-3xl font-bold">{formatPrice(price)}</span>
                  <span className="text-muted-foreground">{t.products.currency}</span>
                  {product.original_price && product.original_price > price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                </>
              ) : product.is_negotiable ? (
                <span className="font-serif text-xl font-medium text-primary">
                  {language === 'uz' ? 'Narxi kelishiladi' : 'Цена договорная'}
                </span>
              ) : (
                <span className="text-muted-foreground">
                  {language === 'uz' ? "Narx ko'rsatilmagan" : 'Цена не указана'}
                </span>
              )}
            </div>

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">{t.products.sizes}</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                        selectedSize === size ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">{t.products.colors}</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                        selectedColor === color ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                size="lg"
                className="flex-1 gap-2 rounded-full"
                onClick={() => addItem(product as any, 1, selectedSize, selectedColor)}
                disabled={inCart || !product.in_stock}
              >
                {inCart ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                {inCart ? (language === 'uz' ? 'Savatda' : 'В корзине') : t.products.addToCart}
              </Button>
              <Button asChild size="lg" variant="outline" className="flex-1 gap-2 rounded-full bg-green-50 border-green-500 text-green-700 hover:bg-green-100">
                <a href={`https://wa.me/998901234567?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" /> {t.products.orderWhatsApp}
                </a>
              </Button>
            </div>

            <Button asChild variant="ghost" className="w-full gap-2">
              <a href="tel:+998901234567">
                <Phone className="w-4 h-4" /> {t.products.requestConsultation}
              </a>
            </Button>

            {/* Materials */}
            {materials.length > 0 && (
              <div className="mt-8 p-4 bg-muted rounded-xl">
                <h4 className="font-medium mb-2">{t.products.materials}</h4>
                <div className="flex flex-wrap gap-2">
                  {materials.map(mat => (
                    <span key={mat} className="px-3 py-1 bg-background rounded-full text-sm">{mat}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Admin debug info */}
            {isAdmin && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                <p><strong>Debug:</strong> ID: {product.id}</p>
                <p>Category ID: {product.category_id || 'null'}</p>
                <p>Slug: {product.slug || 'null'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Description Tabs */}
        {(fullDescription || materials.length > 0) && (
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">{t.products.description}</TabsTrigger>
                <TabsTrigger value="details">{t.products.details}</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4 p-6 bg-card rounded-xl">
                <p className="text-muted-foreground leading-relaxed">
                  {fullDescription || description || (language === 'uz' ? "Ma'lumot mavjud emas" : 'Нет информации')}
                </p>
              </TabsContent>
              <TabsContent value="details" className="mt-4 p-6 bg-card rounded-xl">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">{language === 'uz' ? 'Toifa' : 'Категория'}:</span>{' '}
                    <span className="text-muted-foreground">{categoryName}</span>
                  </div>
                  {materials.length > 0 && (
                    <div>
                      <span className="font-medium">Material:</span>{' '}
                      <span className="text-muted-foreground">{materials.join(', ')}</span>
                    </div>
                  )}
                  {sizes.length > 0 && (
                    <div>
                      <span className="font-medium">{language === 'uz' ? "O'lchamlar" : 'Размеры'}:</span>{' '}
                      <span className="text-muted-foreground">{sizes.join(', ')}</span>
                    </div>
                  )}
                  {colors.length > 0 && (
                    <div>
                      <span className="font-medium">{language === 'uz' ? 'Ranglar' : 'Цвета'}:</span>{' '}
                      <span className="text-muted-foreground">{colors.join(', ')}</span>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Related Products */}
        {filteredRelated.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold mb-6">{t.products.relatedProducts}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRelated.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
