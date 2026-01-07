import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { OrderForm } from '@/components/OrderForm';

export default function Cart() {
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { language, t } = useLanguage();

  const formatPrice = (price: number) => price.toLocaleString('uz-UZ');

  const generateWhatsAppMessage = () => {
    let message = language === 'uz' 
      ? "Assalomu alaykum! Men quyidagi mahsulotlarni buyurtma qilmoqchiman:\n\n"
      : "Здравствуйте! Хочу заказать следующие товары:\n\n";

    items.forEach((item, i) => {
      const name = language === 'uz' ? item.product.name_uz : item.product.name_ru;
      message += `${i + 1}. ${name}\n`;
      message += `   ${t.cart.quantity}: ${item.quantity}\n`;
      if (item.selectedSize) message += `   ${t.products.sizes}: ${item.selectedSize}\n`;
      if (item.selectedColor) message += `   ${t.products.colors}: ${item.selectedColor}\n`;
      message += `   ${language === 'uz' ? 'Narxi' : 'Цена'}: ${formatPrice(item.product.price * item.quantity)} ${t.products.currency}\n\n`;
    });

    message += `${t.cart.total}: ${formatPrice(totalPrice)} ${t.products.currency}`;
    return encodeURIComponent(message);
  };

  if (items.length === 0) {
    return (
      <div id="hero" className="min-h-screen flex items-center justify-center py-16">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-serif text-2xl font-bold mb-2">{t.cart.empty}</h1>
          <p className="text-muted-foreground mb-6">{t.cart.emptyDesc}</p>
          <Button asChild>
            <Link to="/catalog">{t.cart.continueShopping}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div id="hero" className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-3xl font-bold mb-8">{t.cart.title}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const name = language === 'uz' ? item.product.name_uz : item.product.name_ru;
              return (
                <div key={item.product.id} className="flex gap-4 p-4 bg-card rounded-2xl shadow-warm">
                  <Link to={`/product/${item.product.id}`} className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img src={item.product.images[0]} alt={name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.id}`} className="font-medium hover:text-primary transition-colors line-clamp-2">
                      {name}
                    </Link>
                    {(item.selectedSize || item.selectedColor) && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.selectedSize && <span>{item.selectedSize}</span>}
                        {item.selectedSize && item.selectedColor && ' / '}
                        {item.selectedColor && <span>{item.selectedColor}</span>}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="font-serif font-bold">
                          {formatPrice(item.product.price * item.quantity)} <span className="text-sm font-normal text-muted-foreground">{t.products.currency}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.product.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card p-6 rounded-2xl shadow-warm">
              <h3 className="font-serif text-xl font-bold mb-4">{t.cart.total}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{items.length} {t.catalog.products}</span>
                  <span>{formatPrice(totalPrice)} {t.products.currency}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-medium text-lg">
                  <span>{t.cart.total}</span>
                  <span className="font-serif font-bold">{formatPrice(totalPrice)} {t.products.currency}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full gap-2 rounded-full mb-3"
                onClick={() => setOrderFormOpen(true)}
              >
                <Send className="w-5 h-5" /> {language === 'uz' ? 'Buyurtma berish' : 'Оформить заказ'}
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full gap-2 rounded-full bg-green-500 hover:bg-green-600 text-white border-0 mb-3"
              >
                <a href={`https://wa.me/998901234567?text=${generateWhatsAppMessage()}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" /> {t.cart.sendWhatsApp}
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full rounded-full">
                <Link to="/catalog">{t.cart.continueShopping}</Link>
              </Button>
            </div>
            
            <OrderForm open={orderFormOpen} onOpenChange={setOrderFormOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}
