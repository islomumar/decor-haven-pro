import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const { language, t } = useLanguage();
  const { settings } = useSystemSettings();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC key support
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const formatPrice = (price: number) => price.toLocaleString('uz-UZ');

  const getProductName = (product: any) => {
    return (language === 'uz' ? product.name_uz : product.name_ru) || product.name_uz || product.name_ru || product.name || '';
  };

  // Build Telegram message
  const buildTelegramMessage = () => {
    const itemsList = items.map(item => {
      const name = getProductName(item.product);
      return `• ${name} x${item.quantity} = ${formatPrice((item.product.price || 0) * item.quantity)} so'm`;
    }).join('\n');
    
    const message = `🛒 Yangi buyurtma:\n\n${itemsList}\n\n💰 Jami: ${formatPrice(totalPrice)} so'm`;
    return encodeURIComponent(message);
  };

  const telegramNumber = settings?.social_telegram || 'https://t.me/';
  const telegramLink = telegramNumber.startsWith('http') 
    ? `${telegramNumber}?text=${buildTelegramMessage()}`
    : `https://t.me/${telegramNumber.replace('@', '')}?text=${buildTelegramMessage()}`;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer - Desktop: Right side, Mobile: Bottom sheet */}
      <div
        className={cn(
          "fixed z-50 bg-card flex flex-col transition-transform duration-250 ease-out",
          // Desktop styles
          "md:top-0 md:right-0 md:h-full md:w-[400px] md:max-w-[90vw] md:border-l md:border-border",
          // Mobile styles - bottom sheet
          "max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:max-h-[85vh] max-md:rounded-t-2xl max-md:border-t max-md:border-border",
          // Transform states
          isOpen 
            ? "md:translate-x-0 max-md:translate-y-0" 
            : "md:translate-x-full max-md:translate-y-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-serif font-bold text-lg">
              {language === 'uz' ? 'Savatcha' : 'Корзина'}
            </h2>
            {totalItems > 0 && (
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-4">
                {language === 'uz' ? 'Savatchangiz bo\'sh' : 'Ваша корзина пуста'}
              </p>
              <Button asChild onClick={onClose}>
                <Link to="/catalog">
                  {language === 'uz' ? 'Katalogga o\'tish' : 'Перейти в каталог'}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const name = getProductName(item.product);
                const price = item.product.price || 0;
                const image = item.product.images?.[0] || '/placeholder.svg';
                
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 bg-muted/50 rounded-xl"
                  >
                    {/* Image */}
                    <Link 
                      to={`/product/${(item.product as any).slug || item.product.id}`}
                      onClick={onClose}
                      className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted"
                    >
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/product/${(item.product as any).slug || item.product.id}`}
                        onClick={onClose}
                        className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors"
                      >
                        {name}
                      </Link>
                      
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.selectedSize && <span>{item.selectedSize}</span>}
                          {item.selectedSize && item.selectedColor && ' / '}
                          {item.selectedColor && <span>{item.selectedColor}</span>}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-serif font-bold text-sm">
                          {formatPrice(price * item.quantity)} <span className="text-xs text-muted-foreground">{t.products.currency}</span>
                        </span>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-background hover:bg-muted transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-background hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-full text-destructive hover:bg-destructive/10 transition-colors ml-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with CTA */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3 bg-card">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {language === 'uz' ? 'Jami' : 'Итого'}:
              </span>
              <span className="font-serif text-xl font-bold">
                {formatPrice(totalPrice)} <span className="text-sm text-muted-foreground">{t.products.currency}</span>
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-2">
              <Button
                asChild
                size="lg"
                className="w-full rounded-full gap-2 bg-[#0088cc] hover:bg-[#0077b5]"
              >
                <a href={telegramLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  {language === 'uz' ? 'Telegram orqali buyurtma' : 'Заказать через Telegram'}
                </a>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full rounded-full"
                onClick={onClose}
              >
                <Link to="/cart">
                  {language === 'uz' ? 'Savatni ko\'rish' : 'Посмотреть корзину'}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
