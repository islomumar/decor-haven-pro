import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingBag, MessageCircle, Phone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/data';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';

export default function ProductDetails() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { addItem, isInCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Mahsulot topilmadi</h1>
          <Button asChild><Link to="/catalog">Katalogga qaytish</Link></Button>
        </div>
      </div>
    );
  }

  const name = language === 'uz' ? product.name_uz : product.name_ru;
  const description = language === 'uz' ? product.description_uz : product.description_ru;
  const fullDescription = language === 'uz' ? product.fullDescription_uz : product.fullDescription_ru;
  const formatPrice = (price: number) => price.toLocaleString('uz-UZ');
  const inCart = isInCart(product.id);

  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const whatsappMessage = encodeURIComponent(
    `Assalomu alaykum! Men "${name}" mahsulotiga qiziqyapman.\n\nNarxi: ${formatPrice(product.price)} so'm\n\nBatafsil ma'lumot berishingizni so'rayman.`
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
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
              <img
                src={product.images[selectedImage]}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-gold-accent text-gold-accent" />
                <span className="font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">({product.reviewCount} {language === 'uz' ? 'sharh' : 'отзывов'})</span>
              {product.inStock ? (
                <span className="ml-auto text-sm text-green-600 font-medium">{t.products.inStock}</span>
              ) : (
                <span className="ml-auto text-sm text-destructive font-medium">{t.products.outOfStock}</span>
              )}
            </div>

            <h1 className="font-serif text-3xl font-bold mb-4">{name}</h1>
            <p className="text-muted-foreground mb-6">{description}</p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-3xl font-bold">{formatPrice(product.price)}</span>
              <span className="text-muted-foreground">{t.products.currency}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">{t.products.sizes}</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
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
            {product.colors.length > 0 && (
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">{t.products.colors}</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
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
                onClick={() => addItem(product, 1, selectedSize, selectedColor)}
                disabled={inCart}
              >
                {inCart ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                {inCart ? 'Savatda' : t.products.addToCart}
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
            <div className="mt-8 p-4 bg-muted rounded-xl">
              <h4 className="font-medium mb-2">{t.products.materials}</h4>
              <div className="flex flex-wrap gap-2">
                {product.materials.map(mat => (
                  <span key={mat} className="px-3 py-1 bg-background rounded-full text-sm">{mat}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">{t.products.description}</TabsTrigger>
              <TabsTrigger value="details">{t.products.details}</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 p-6 bg-card rounded-xl">
              <p className="text-muted-foreground leading-relaxed">{fullDescription}</p>
            </TabsContent>
            <TabsContent value="details" className="mt-4 p-6 bg-card rounded-xl">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><span className="font-medium">Toifa:</span> <span className="text-muted-foreground">{product.categoryId}</span></div>
                <div><span className="font-medium">Material:</span> <span className="text-muted-foreground">{product.materials.join(', ')}</span></div>
                <div><span className="font-medium">O'lchamlar:</span> <span className="text-muted-foreground">{product.sizes.join(', ')}</span></div>
                <div><span className="font-medium">Ranglar:</span> <span className="text-muted-foreground">{product.colors.join(', ')}</span></div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold mb-6">{t.products.relatedProducts}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
