import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/data';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const name = language === 'uz' ? product.name_uz : product.name_ru;
  const formatPrice = (price: number) => price.toLocaleString('uz-UZ');

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300">
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={product.images[0]}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.originalPrice && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors mb-2">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-gold-accent text-gold-accent" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-serif font-bold text-lg text-foreground">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-muted-foreground ml-1">{t.products.currency}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant={inCart ? "secondary" : "default"}
            className="rounded-full"
            onClick={(e) => {
              e.preventDefault();
              if (!inCart) addItem(product);
            }}
          >
            {inCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
