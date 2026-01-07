import { useTheme } from '@/hooks/useTheme';

interface ThemeLoaderProps {
  children: React.ReactNode;
}

export function ThemeLoader({ children }: ThemeLoaderProps) {
  const { isThemeReady, isLoading } = useTheme();

  // Show loader until theme is ready
  if (!isThemeReady && isLoading) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center"
        style={{ 
          backgroundColor: 'hsl(var(--background, 0 0% 100%))',
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div 
            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{ 
              borderColor: 'hsl(var(--primary, 0 0% 20%))',
              borderTopColor: 'transparent'
            }}
          />
          <p 
            className="text-sm"
            style={{ color: 'hsl(var(--muted-foreground, 0 0% 45%))' }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
