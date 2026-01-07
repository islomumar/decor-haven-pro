import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export function useSEO({
  title,
  description,
  keywords,
  noindex = false,
  nofollow = false,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
}: SEOProps) {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }

    // Helper to update or create meta tag
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      
      if (content) {
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute(attr, name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      } else if (meta) {
        meta.remove();
      }
    };

    // Update meta tags
    if (description) {
      updateMeta('description', description);
    }

    if (keywords) {
      updateMeta('keywords', keywords);
    }

    // Robots meta
    const robotsContent = [
      noindex ? 'noindex' : 'index',
      nofollow ? 'nofollow' : 'follow',
    ].join(', ');
    updateMeta('robots', robotsContent);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }

    // Open Graph tags
    updateMeta('og:title', ogTitle || title || '', true);
    updateMeta('og:description', ogDescription || description || '', true);
    if (ogImage) {
      updateMeta('og:image', ogImage, true);
    }
    updateMeta('og:type', 'website', true);

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', ogTitle || title || '');
    updateMeta('twitter:description', ogDescription || description || '');
    if (ogImage) {
      updateMeta('twitter:image', ogImage);
    }

    // Cleanup function to reset on unmount
    return () => {
      // Don't remove meta tags on cleanup, just leave them for the next page
    };
  }, [title, description, keywords, noindex, nofollow, canonical, ogTitle, ogDescription, ogImage]);
}

export default useSEO;
