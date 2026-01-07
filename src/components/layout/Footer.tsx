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
  const contactPhone = settings?.contact_phone || '+998 90 123 45 67';

  const quickLinks = [
    { to: '/', label: t.nav.home },
    { to: '/catalog', label: t.nav.catalog },
    { to: '/about', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
    { to: '/faq', label: t.nav.faq },
  ];

  const socialLinks = [
    { href: settings?.social_facebook, icon: Facebook, label: 'Facebook' },
    { href: settings?.social_instagram, icon: Instagram, label: 'Instagram' },
    { href: settings?.social_telegram, icon: Send, label: 'Telegram' },
  ];

  const hasSocialLinks = settings?.social_facebook || settings?.social_instagram || settings?.social_telegram;

  return (
    <footer className="bg-gradient-to-b from-[#8B6F4E] to-[#6B5340] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="space-y-5">
            {/* Logo */}
            <div className="mb-6">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={siteName} 
                  className="h-12 max-w-[180px] object-contain brightness-0 invert"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`items-center gap-3 ${logoUrl ? 'hidden' : 'flex'}`}
                style={{ display: logoUrl ? 'none' : 'flex' }}
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#6B5340] font-serif font-bold text-2xl">
                    {siteName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/80 text-sm leading-relaxed max-w-xs">
              {shortDescription || t.footer.description}
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              {hasSocialLinks ? (
                socialLinks.map((social) => 
                  social.href ? (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center 
                                 hover:bg-white/10 hover:border-white/50 transition-all duration-300 group"
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
                    </a>
                  ) : null
                )
              ) : (
                <>
                  <a href="#" className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center 
                             hover:bg-white/10 hover:border-white/50 transition-all duration-300 group" aria-label="Facebook">
                    <Facebook className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
                  </a>
                  <a href="#" className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center 
                             hover:bg-white/10 hover:border-white/50 transition-all duration-300 group" aria-label="Instagram">
                    <Instagram className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
                  </a>
                  <a href="#" className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center 
                             hover:bg-white/10 hover:border-white/50 transition-all duration-300 group" aria-label="Telegram">
                    <Send className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-5 text-white">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-white/70 hover:text-white text-sm transition-colors duration-200 
                               inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-5 text-white">
              {t.footer.contact}
            </h4>
            <ul className="space-y-4">
              {address && (
                <li className="flex items-start gap-3 group">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-white/60" />
                  <span className="text-white/70 text-sm leading-relaxed">
                    {address}
                  </span>
                </li>
              )}
              {contactPhone && (
                <li className="flex items-center gap-3 group">
                  <Phone className="w-5 h-5 flex-shrink-0 text-white/60" />
                  <a 
                    href={`tel:${contactPhone.replace(/\s/g, '')}`} 
                    className="text-white/70 hover:text-white text-sm transition-colors duration-200"
                  >
                    {contactPhone}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 flex-shrink-0 text-white/60" />
                <a 
                  href={`mailto:info@${window.location.hostname === 'localhost' ? 'example.com' : window.location.hostname}`} 
                  className="text-white/70 hover:text-white text-sm transition-colors duration-200 break-all"
                >
                  info@{window.location.hostname === 'localhost' ? 'example.com' : window.location.hostname}
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours Column */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-5 text-white">
              {t.footer.workingHours}
            </h4>
            <div className="text-sm text-white/70 leading-relaxed">
              {workingHours ? (
                <p>{workingHours}</p>
              ) : (
                <div className="space-y-2">
                  <p>{t.footer.weekdays}</p>
                  <p className="text-white/90 font-medium">{t.footer.saturday}</p>
                  <p>{t.footer.sunday}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} {siteName}. {t.footer.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
