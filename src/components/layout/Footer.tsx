import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Send } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSystemSettings } from '@/hooks/useSystemSettings';

export function Footer() {
  const { language, t } = useLanguage();
  const { settings, getSiteName, getLogo, getShortDescription, getAddress, getWorkingHours } = useSystemSettings();

  const siteName = getSiteName();
  const logoUrl = getLogo();
  const shortDescription = getShortDescription(language);
  const address = getAddress(language);
  const workingHours = getWorkingHours(language);
  const contactPhone = settings?.contact_phone || '';

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={siteName} 
                  className="h-10 max-w-[160px] object-contain brightness-0 invert"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`flex items-center gap-2 ${logoUrl ? 'hidden' : ''}`}>
                <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
                  <span className="text-primary font-serif font-bold text-xl">
                    {siteName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-serif text-xl font-bold">{siteName}</span>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
              {shortDescription || t.footer.description}
            </p>
            <div className="flex gap-3">
              {settings?.social_facebook && (
                <a 
                  href={settings.social_facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings?.social_instagram && (
                <a 
                  href={settings.social_instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.social_telegram && (
                <a 
                  href={settings.social_telegram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </a>
              )}
              {/* Show default icons if no social links configured */}
              {!settings?.social_facebook && !settings?.social_instagram && !settings?.social_telegram && (
                <>
                  <a href="#" className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                    <Send className="w-5 h-5" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">{t.footer.quickLinks}</h4>
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
            <h4 className="font-serif font-semibold text-lg mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3">
              {address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-primary-foreground/80 text-sm">{address}</span>
                </li>
              )}
              {contactPhone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="text-primary-foreground/80 hover:text-primary-foreground text-sm">
                    {contactPhone}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href={`mailto:info@${window.location.hostname}`} className="text-primary-foreground/80 hover:text-primary-foreground text-sm">
                  info@{window.location.hostname === 'localhost' ? 'example.com' : window.location.hostname}
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">{t.footer.workingHours}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              {workingHours ? (
                <li>{workingHours}</li>
              ) : (
                <>
                  <li>{t.footer.weekdays}</li>
                  <li>{t.footer.saturday}</li>
                  <li>{t.footer.sunday}</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} {siteName}. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
