import { useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
  sizes?: string;
  priority?: boolean;
}

// Generate optimized image URL with size parameters for Supabase storage
const getOptimizedUrl = (url: string, width?: number): string => {
  if (!url || url.startsWith('/') || url.startsWith('data:')) {
    return url;
  }
  
  // For Supabase storage URLs, add transform parameters
  if (url.includes('supabase') && url.includes('/storage/')) {
    const separator = url.includes('?') ? '&' : '?';
    const params = width ? `width=${width}&quality=80` : 'quality=80';
    return `${url}${separator}${params}`;
  }
  
  // For Unsplash, use their optimization params
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    const params = width ? `w=${width}&q=80&fm=webp&auto=format` : 'q=80&fm=webp&auto=format';
    return `${url}${separator}${params}`;
  }
  
  return url;
};

// Generate srcset for responsive images
const generateSrcSet = (url: string): string => {
  if (!url || url.startsWith('/') || url.startsWith('data:')) {
    return '';
  }
  
  const widths = [400, 800, 1200, 1600];
  
  if (url.includes('unsplash.com')) {
    return widths
      .map(w => `${getOptimizedUrl(url, w)} ${w}w`)
      .join(', ');
  }
  
  if (url.includes('supabase') && url.includes('/storage/')) {
    return widths
      .map(w => `${getOptimizedUrl(url, w)} ${w}w`)
      .join(', ');
  }
  
  return '';
};

export const LazyImage = memo(function LazyImage({
  src,
  alt,
  placeholder = '/placeholder.svg',
  className,
  wrapperClassName,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  priority = false,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const [blurDataUrl, setBlurDataUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  // Generate tiny blur placeholder
  useEffect(() => {
    if (src && !src.startsWith('/') && !src.startsWith('data:')) {
      // Create a tiny version for blur effect
      const tinyUrl = getOptimizedUrl(src, 20);
      setBlurDataUrl(tinyUrl);
    }
  }, [src]);

  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  const srcSet = generateSrcSet(src);
  const optimizedSrc = getOptimizedUrl(src);

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-muted',
        wrapperClassName
      )}
    >
      {/* Blur placeholder */}
      {!isLoaded && blurDataUrl && (
        <img
          src={blurDataUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl"
        />
      )}
      
      {/* Skeleton placeholder */}
      {!isLoaded && !blurDataUrl && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={error ? placeholder : optimizedSrc}
          srcSet={!error && srcSet ? srcSet : undefined}
          sizes={!error && srcSet ? sizes : undefined}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...props}
        />
      )}
    </div>
  );
});

// Thumbnail version for product cards - memoized for performance
interface ThumbnailImageProps extends LazyImageProps {
  size?: 'sm' | 'md' | 'lg';
}

export const ThumbnailImage = memo(function ThumbnailImage({
  src,
  size = 'md',
  className,
  ...props
}: ThumbnailImageProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-full h-full',
    lg: 'w-full h-full',
  };

  const sizesMap = {
    sm: '48px',
    md: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
    lg: '(max-width: 640px) 100vw, 50vw',
  };

  return (
    <LazyImage
      src={src}
      sizes={sizesMap[size]}
      className={cn(
        'object-cover',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
});

// Hero image with priority loading
export const HeroImage = memo(function HeroImage({
  src,
  className,
  ...props
}: LazyImageProps) {
  return (
    <LazyImage
      src={src}
      priority
      sizes="100vw"
      className={cn('object-cover', className)}
      {...props}
    />
  );
});
