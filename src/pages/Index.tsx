import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { products, categories } from '@/lib/data';
import { useLanguage } from '@/hooks/useLanguage';
import { EditableText } from '@/components/EditableText';

export default function Index() {
  const { language, t } = useLanguage();
  const featuredProducts = products.filter(p => p.featured).slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920"
            alt="Modern living room"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in">
              <EditableText 
                contentKey="hero_title" 
                fallback={t.hero.title}
                as="span"
                className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold"
              />
            </h1>
            <p className="text-lg text-muted-foreground mb-8 animate-fade-in">
              <EditableText 
                contentKey="hero_subtitle" 
                fallback={t.hero.subtitle}
                as="span"
                className="text-lg"
              />
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/catalog">
                  <EditableText 
                    contentKey="hero_cta" 
                    fallback={t.hero.cta}
                    as="span"
                  />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link to="/contact">
                  <EditableText 
                    contentKey="hero_consultation" 
                    fallback={t.hero.consultation}
                    as="span"
                  />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="py-12 bg-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">
            <EditableText 
              contentKey="promo_title" 
              fallback="Maxsus taklif!"
              as="span"
              className="font-serif text-2xl md:text-3xl font-bold"
            />
          </h2>
          <p className="text-muted-foreground text-lg">
            <EditableText 
              contentKey="promo_subtitle" 
              fallback="Barcha mebellarga 20% chegirma"
              as="span"
              className="text-lg"
            />
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-3xl font-bold">
              <EditableText 
                contentKey="featured_title" 
                fallback={t.products.featured}
                as="span"
                className="font-serif text-3xl font-bold"
              />
            </h2>
            <Button asChild variant="ghost" className="gap-2">
              <Link to="/catalog">{t.products.viewAll} <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-10">
            <EditableText 
              contentKey="categories_title" 
              fallback={t.categories.title}
              as="span"
              className="font-serif text-3xl font-bold"
            />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map(category => (
              <Link
                key={category.id}
                to={`/catalog?category=${category.id}`}
                className="group relative aspect-square rounded-2xl overflow-hidden"
              >
                <img src={category.image} alt={language === 'uz' ? category.name_uz : category.name_ru} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-medium text-lg">{language === 'uz' ? category.name_uz : category.name_ru}</h3>
                  <p className="text-white/70 text-sm">{category.productCount} {t.catalog.products}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
