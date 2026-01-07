import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, User, Phone, MessageSquare, Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    renovationStatus: '',
    preferredTime: '',
    comment: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (price: number) => price.toLocaleString('uz-UZ');

  const getProductName = (product: any) => {
    return (language === 'uz' ? product.name_uz : product.name_ru) || product.name_uz || product.name_ru || product.name || '';
  };

  const renovationOptions = [
    { value: 'finished', label: language === 'uz' ? 'Uy to\'liq tayyor' : 'Дом полностью готов' },
    { value: 'in_progress', label: language === 'uz' ? 'Remont jarayonida' : 'Ремонт в процессе' },
    { value: 'planning', label: language === 'uz' ? 'Remontni boshlashni rejalashtirmoqdaman' : 'Планирую начать ремонт' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = language === 'uz' ? 'Ism kiritish shart' : 'Введите имя';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = language === 'uz' ? 'Telefon raqam kiritish shart' : 'Введите номер телефона';
    } else if (!/^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = language === 'uz' ? 'Noto\'g\'ri telefon formati' : 'Неверный формат телефона';
    }

    if (!formData.renovationStatus) {
      newErrors.renovationStatus = language === 'uz' ? 'Tanlash shart' : 'Выберите вариант';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (value: string) => {
    // Auto-format phone number
    let cleaned = value.replace(/\D/g, '');
    if (!cleaned.startsWith('998')) {
      cleaned = '998' + cleaned;
    }
    cleaned = cleaned.slice(0, 12);
    
    let formatted = '+998';
    if (cleaned.length > 3) formatted += ' ' + cleaned.slice(3, 5);
    if (cleaned.length > 5) formatted += ' ' + cleaned.slice(5, 8);
    if (cleaned.length > 8) formatted += ' ' + cleaned.slice(8, 10);
    if (cleaned.length > 10) formatted += ' ' + cleaned.slice(10, 12);
    
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (items.length === 0) {
      toast({
        title: language === 'uz' ? 'Xatolik' : 'Ошибка',
        description: language === 'uz' ? 'Savatcha bo\'sh' : 'Корзина пуста',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate order number (trigger will override, but types require it)
      const orderNumber = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: orderNumber,
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          customer_message: [
            formData.renovationStatus && `Uy holati: ${renovationOptions.find(o => o.value === formData.renovationStatus)?.label}`,
            formData.preferredTime && `Qo'ng'iroq vaqti: ${formData.preferredTime}`,
            formData.comment && `Izoh: ${formData.comment}`,
          ].filter(Boolean).join('\n') || null,
          total_price: totalPrice,
          status: 'new',
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name_snapshot: getProductName(item.product),
        quantity: item.quantity,
        price_snapshot: item.product.price || 0,
        selected_options: {
          size: item.selectedSize,
          color: item.selectedColor,
        },
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart and redirect
      clearCart();
      navigate('/thank-you', { state: { orderNumber: orderData.order_number } });

    } catch (error: any) {
      console.error('Order error:', error);
      toast({
        title: language === 'uz' ? 'Xatolik yuz berdi' : 'Произошла ошибка',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div id="hero" className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">
            {language === 'uz' ? 'Savatcha bo\'sh' : 'Корзина пуста'}
          </h1>
          <Button asChild>
            <Link to="/catalog">
              {language === 'uz' ? 'Katalogga o\'tish' : 'Перейти в каталог'}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div id="hero" className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6 gap-2">
          <Link to="/cart"><ArrowLeft className="w-4 h-4" /> {t.common.back}</Link>
        </Button>

        <h1 className="font-serif text-3xl font-bold mb-8">
          {language === 'uz' ? 'Buyurtmani rasmiylashtirish' : 'Оформление заказа'}
        </h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {language === 'uz' ? 'To\'liq ism' : 'Полное имя'} *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={language === 'uz' ? 'Ismingizni kiriting' : 'Введите ваше имя'}
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {language === 'uz' ? 'Telefon raqam' : 'Номер телефона'} *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              {/* Renovation Status */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  {language === 'uz' ? 'Uyingiz holati' : 'Состояние дома'} *
                </Label>
                <RadioGroup
                  value={formData.renovationStatus}
                  onValueChange={(value) => setFormData({ ...formData, renovationStatus: value })}
                  className="space-y-2"
                >
                  {renovationOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.renovationStatus && (
                  <p className="text-sm text-destructive">{errors.renovationStatus}</p>
                )}
              </div>

              {/* Preferred Contact Time */}
              <div className="space-y-2">
                <Label htmlFor="preferredTime" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {language === 'uz' ? 'Qo\'ng\'iroq uchun qulay vaqt' : 'Удобное время для звонка'}
                </Label>
                <Input
                  id="preferredTime"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  placeholder={language === 'uz' ? 'Masalan: 10:00 - 18:00' : 'Например: 10:00 - 18:00'}
                />
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor="comment" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {language === 'uz' ? 'Qo\'shimcha izoh' : 'Дополнительный комментарий'}
                </Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder={language === 'uz' ? 'Savollaringiz yoki izohlaringiz...' : 'Ваши вопросы или комментарии...'}
                  rows={3}
                />
              </div>

              {/* Submit Button - Mobile */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full h-14 text-base font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (language === 'uz' ? 'Yuborilmoqda...' : 'Отправка...') 
                    : (language === 'uz' ? 'Buyurtma berish' : 'Оформить заказ')}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-muted/40 rounded-2xl p-6 sticky top-24">
              <h2 className="font-serif font-bold text-lg mb-4">
                {language === 'uz' ? 'Buyurtma tarkibi' : 'Состав заказа'}
              </h2>

              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                {items.map((item) => {
                  const name = getProductName(item.product);
                  const price = item.product.price || 0;
                  const image = item.product.images?.[0] || '/placeholder.svg';

                  return (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={image}
                        alt={name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} x {formatPrice(price)} {t.products.currency}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        {formatPrice(price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-medium">
                    {language === 'uz' ? 'Jami' : 'Итого'}:
                  </span>
                  <span className="font-serif text-2xl font-bold">
                    {formatPrice(totalPrice)} <span className="text-sm font-normal text-muted-foreground">{t.products.currency}</span>
                  </span>
                </div>

                {/* Submit Button - Desktop */}
                <Button
                  type="submit"
                  form="checkout-form"
                  size="lg"
                  className="w-full rounded-full h-12 text-base font-semibold hidden lg:flex"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting 
                    ? (language === 'uz' ? 'Yuborilmoqda...' : 'Отправка...') 
                    : (language === 'uz' ? 'Buyurtma berish' : 'Оформить заказ')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
