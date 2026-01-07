import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

export default function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: t.contact.form.success,
      description: "Tez orada siz bilan bog'lanamiz!",
    });
    
    setForm({ name: '', phone: '', email: '', message: '' });
    setLoading(false);
  };

  const contactInfo = [
    { icon: MapPin, label: t.contact.info.address, value: t.contact.info.addressValue },
    { icon: Phone, label: t.contact.info.phone, value: '+998 90 123 45 67', href: 'tel:+998901234567' },
    { icon: Mail, label: t.contact.info.email, value: 'info@mebelusta.uz', href: 'mailto:info@mebelusta.uz' },
    { icon: Clock, label: t.contact.info.workingHours, value: 'Du-Ju: 9:00-18:00, Sha: 10:00-16:00' },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4">{t.contact.title}</h1>
          <p className="text-muted-foreground text-lg">{t.contact.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-card p-8 rounded-2xl shadow-warm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">{t.contact.form.name}</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Ismingizni kiriting"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">{t.contact.form.phone}</label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">{t.contact.form.email}</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">{t.contact.form.message}</label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={4}
                  placeholder="Xabaringizni yozing..."
                />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-full" disabled={loading}>
                {loading ? 'Yuborilmoqda...' : t.contact.form.submit}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-card rounded-xl shadow-warm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">{item.label}</h4>
                  {item.href ? (
                    <a href={item.href} className="text-muted-foreground hover:text-primary transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-muted-foreground">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="flex-1 gap-2 rounded-full bg-green-500 hover:bg-green-600">
                <a href="https://wa.me/998901234567" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="flex-1 gap-2 rounded-full">
                <a href="https://t.me/mebelusta" target="_blank" rel="noopener noreferrer">
                  <Send className="w-5 h-5" /> Telegram
                </a>
              </Button>
            </div>

            {/* Map Placeholder */}
            <div className="rounded-2xl overflow-hidden h-64 bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.548469746612!2d69.2243!3d41.3111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE4JzQwLjAiTiA2OcKwMTMnMjcuNSJF!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
