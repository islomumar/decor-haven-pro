import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
}

export function LazyImage({
  src,
  alt,
  placeholder = '/placeholder.svg',
  className,
  wrapperClassName,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  // Get optimized image URL (for Supabase storage images)
  const getOptimizedUrl = (url: string) => {
    // If it's a Supabase storage URL, we could add transformation parameters
    // For now, just return the original URL
    return url;
  };

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-muted',
        wrapperClassName
      )}
    >
      {/* Placeholder/skeleton while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={error ? placeholder : getOptimizedUrl(src)}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
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
}

// Thumbnail version for product cards
interface ThumbnailImageProps extends LazyImageProps {
  size?: 'sm' | 'md' | 'lg';
}

export function ThumbnailImage({
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

  return (
    <LazyImage
      src={src}
      className={cn(
        'object-cover',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}