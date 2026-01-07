import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Send } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { EditableText } from '@/components/EditableText';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-serif font-bold text-xl">M</span>
              </div>
              <span className="font-serif text-xl font-bold">Mebel Usta</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
              <EditableText 
                contentKey="footer_description" 
                fallback={t.footer.description}
                as="span"
                className="text-sm"
              />
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://t.me/mebelusta" className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">
              <EditableText 
                contentKey="footer_quicklinks_title" 
                fallback={t.footer.quickLinks}
                as="span"
                className="font-semibold text-lg"
              />
            </h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground text-sm">{t.nav.home}</Link></li>
              <li><Link to="/catalog" className="text-primary-foreground/80 hover:text-primary-foreground text-sm">{t.nav.catalog}</Link></li>
              <li><Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground text-sm">{t.nav.about}</Link></li>
              <li><Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground text-sm">{t.nav.contact}</Link></li>
              <li><Link to="/faq" className="text-primary-foreground/80 hover:text-primary-foreground text-sm">{t.nav.faq}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">
              <EditableText 
                contentKey="footer_contact_title" 
                fallback={t.footer.contact}
                as="span"
                className="font-semibold text-lg"
              />
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80 text-sm">
                  <EditableText 
                    contentKey="footer_address" 
                    fallback="Toshkent sh., Chilonzor tumani, Bunyodkor ko'chasi, 15-uy"
                    as="span"
                    className="text-sm"
                  />
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+998901234567" className="text-primary-foreground/80 hover:text-primary-foreground text-sm">
                  <EditableText 
                    contentKey="footer_phone" 
                    fallback="+998 90 123 45 67"
                    as="span"
                    className="text-sm"
                  />
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:info@mebelusta.uz" className="text-primary-foreground/80 hover:text-primary-foreground text-sm">
                  <EditableText 
                    contentKey="footer_email" 
                    fallback="info@mebelusta.uz"
                    as="span"
                    className="text-sm"
                  />
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">
              <EditableText 
                contentKey="footer_hours_title" 
                fallback={t.footer.workingHours}
                as="span"
                className="font-semibold text-lg"
              />
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <EditableText 
                  contentKey="footer_weekdays" 
                  fallback={t.footer.weekdays}
                  as="span"
                  className="text-sm"
                />
              </li>
              <li>
                <EditableText 
                  contentKey="footer_saturday" 
                  fallback={t.footer.saturday}
                  as="span"
                  className="text-sm"
                />
              </li>
              <li>
                <EditableText 
                  contentKey="footer_sunday" 
                  fallback={t.footer.sunday}
                  as="span"
                  className="text-sm"
                />
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/60">
          © 2024 Mebel Usta. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
