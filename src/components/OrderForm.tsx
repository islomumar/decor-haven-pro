import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const orderSchema = z.object({
  name: z.string().trim().min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak').max(100),
  phone: z.string().trim().min(9, 'Telefon raqamini to\'liq kiriting').max(20),
  message: z.string().max(500).optional(),
});

interface OrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderForm({ open, onOpenChange }: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { language } = useLanguage();
  const { items, totalPrice, clearCart } = useCart();

  const t = {
    uz: {
      title: 'Buyurtma berish',
      description: 'Ma\'lumotlaringizni kiriting, biz siz bilan bog\'lanamiz',
      name: 'Ismingiz',
      namePlaceholder: 'To\'liq ismingiz',
      phone: 'Telefon raqamingiz',
      phonePlaceholder: '+998 90 123 45 67',
      message: 'Qo\'shimcha xabar',
      messagePlaceholder: 'Sizning xabaringiz (ixtiyoriy)',
      submit: 'Buyurtma yuborish',
      success: 'Buyurtmangiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.',
      error: 'Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.',
    },
    ru: {
      title: 'Оформить заказ',
      description: 'Введите ваши данные, мы свяжемся с вами',
      name: 'Ваше имя',
      namePlaceholder: 'Полное имя',
      phone: 'Номер телефона',
      phonePlaceholder: '+998 90 123 45 67',
      message: 'Дополнительное сообщение',
      messagePlaceholder: 'Ваше сообщение (необязательно)',
      submit: 'Отправить заказ',
      success: 'Ваш заказ принят! Мы скоро свяжемся с вами.',
      error: 'Произошла ошибка. Пожалуйста, попробуйте снова.',
    },
  };

  const text = t[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const result = orderSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Savat bo\'sh',
        description: 'Iltimos, mahsulot qo\'shing',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: '',
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_message: formData.message || null,
          total_price: totalPrice,
          status: 'new',
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name_snapshot: language === 'uz' ? item.product.name_uz : item.product.name_ru,
        selected_options: {
          size: item.selectedSize,
          color: item.selectedColor,
        },
        quantity: item.quantity,
        price_snapshot: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Send Telegram notification
      await sendTelegramNotification(order, orderItems);

      toast({
        title: language === 'uz' ? 'Muvaffaqiyat!' : 'Успешно!',
        description: text.success,
      });

      clearCart();
      onOpenChange(false);
      setFormData({ name: '', phone: '', message: '' });
    } catch (error) {
      console.error('Order error:', error);
      toast({
        title: language === 'uz' ? 'Xatolik' : 'Ошибка',
        description: text.error,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTelegramNotification = async (order: any, orderItems: any[]) => {
    try {
      // Get Telegram settings
      const { data: settings } = await supabase
        .from('settings')
        .select('*');

      const settingsMap: Record<string, string> = {};
      settings?.forEach(s => {
        settingsMap[s.key] = s.value || '';
      });

      if (settingsMap['telegram_enabled'] !== 'true') return;
      if (!settingsMap['telegram_bot_token'] || !settingsMap['telegram_chat_id']) return;

      const itemsList = orderItems.map(item => 
        `• ${item.product_name_snapshot} x${item.quantity}`
      ).join('\n');

      const message = `
🛒 *Yangi buyurtma!*

📋 *Buyurtma:* ${order.order_number}
👤 *Mijoz:* ${order.customer_name}
📞 *Telefon:* ${order.customer_phone}

*Mahsulotlar:*
${itemsList}

💰 *Jami:* ${new Intl.NumberFormat('uz-UZ').format(order.total_price)} so'm

${order.customer_message ? `💬 *Xabar:* ${order.customer_message}` : ''}
      `.trim();

      await fetch(`https://api.telegram.org/bot${settingsMap['telegram_bot_token']}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settingsMap['telegram_chat_id'],
          text: message,
          parse_mode: 'Markdown',
        }),
      });
    } catch (error) {
      console.error('Telegram notification error:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Summary */}
          <div className="bg-muted p-3 rounded-lg space-y-2">
            {items.slice(0, 3).map(item => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>{language === 'uz' ? item.product.name_uz : item.product.name_ru} x{item.quantity}</span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-xs text-muted-foreground">+{items.length - 3} ta mahsulot</p>
            )}
            <div className="border-t pt-2 flex justify-between font-medium">
              <span>Jami:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">{text.name} *</Label>
            <Input
              id="name"
              placeholder={text.namePlaceholder}
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{text.phone} *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder={text.phonePlaceholder}
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{text.message}</Label>
            <Textarea
              id="message"
              placeholder={text.messagePlaceholder}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === 'uz' ? 'Yuborilmoqda...' : 'Отправка...'}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {text.submit}
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
