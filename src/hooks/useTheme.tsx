import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Theme, defaultThemes } from '@/lib/themes';

const THEME_CACHE_KEY = 'furniture-active-theme';
const THEME_READY_KEY = 'furniture-theme-ready';

interface ThemeContextType {
  currentTheme: Theme | null;
  themes: Theme[];
  isLoading: boolean;
  isThemeReady: boolean;
  setActiveTheme: (themeId: string) => Promise<void>;
  previewTheme: (theme: Theme) => void;
  resetPreview: () => void;
  isPreviewMode: boolean;
  refreshThemes: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Cache theme to localStorage
const cacheTheme = (theme: Theme) => {
  try {
    localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(theme));
    localStorage.setItem(THEME_READY_KEY, 'true');
  } catch (e) {
    console.warn('Failed to cache theme:', e);
  }
};

// Get cached theme from localStorage
const getCachedTheme = (): Theme | null => {
  try {
    const cached = localStorage.getItem(THEME_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Failed to get cached theme:', e);
  }
  return null;
};

// Check if theme has ever been loaded
const hasThemeBeenLoaded = (): boolean => {
  try {
    return localStorage.getItem(THEME_READY_KEY) === 'true';
  } catch (e) {
    return false;
  }
};

// Apply theme to document - can be called before React mounts
export const applyThemeToDocument = (theme: Theme) => {
  const root = document.documentElement;
  
  // Apply color palette
  Object.entries(theme.colorPalette).forEach(([key, value]) => {
    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`--${cssVar}`, value);
  });

  // Apply typography
  root.style.setProperty('--font-sans', theme.typography.fontSans);
  root.style.setProperty('--font-serif', theme.typography.fontSerif);
  root.style.setProperty('--font-heading', theme.typography.fontHeading);

  // Apply component styles
  root.style.setProperty('--radius', theme.componentStyles.borderRadius);
  root.style.setProperty('--button-radius', theme.componentStyles.buttonRadius);
  root.style.setProperty('--card-radius', theme.componentStyles.cardRadius);
  root.style.setProperty('--shadow-sm', theme.componentStyles.shadowSm);
  root.style.setProperty('--shadow-md', theme.componentStyles.shadowMd);
  root.style.setProperty('--shadow-lg', theme.componentStyles.shadowLg);

  // Apply layout settings
  root.style.setProperty('--container-max-width', theme.layoutSettings.containerMaxWidth);
  root.style.setProperty('--section-spacing', theme.layoutSettings.sectionSpacing);
  root.style.setProperty('--card-padding', theme.layoutSettings.cardPadding);

  // Toggle dark mode class
  if (theme.isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Mark theme as applied
  root.setAttribute('data-theme-loaded', 'true');
};

// Initialize theme immediately (called before React mounts)
export const initializeTheme = (): Theme | null => {
  const cached = getCachedTheme();
  if (cached) {
    applyThemeToDocument(cached);
    return cached;
  }
  // No cached theme - site will show loader until theme is fetched
  return null;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(() => getCachedTheme());
  const [savedTheme, setSavedTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isThemeReady, setIsThemeReady] = useState(() => hasThemeBeenLoaded() && getCachedTheme() !== null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const applyTheme = useCallback((theme: Theme) => {
    applyThemeToDocument(theme);
    setIsThemeReady(true);
  }, []);

  const fetchThemes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('name');

      if (error) throw error;

      if (data && data.length > 0) {
        const mappedThemes: Theme[] = data.map((t: any) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          colorPalette: t.color_palette,
          typography: t.typography,
          componentStyles: t.component_styles,
          layoutSettings: t.layout_settings,
          isActive: t.is_active,
          isDark: t.is_dark
        }));
        setThemes(mappedThemes);

        const active = mappedThemes.find(t => t.isActive);
        if (active) {
          setCurrentTheme(active);
          setSavedTheme(active);
          applyTheme(active);
          cacheTheme(active);
        } else {
          // No active theme - use first one from list
          const firstTheme = mappedThemes[0];
          setCurrentTheme(firstTheme);
          setSavedTheme(firstTheme);
          applyTheme(firstTheme);
          cacheTheme(firstTheme);
        }
      } else {
        // No themes in database - use default from lib/themes
        const defaultTheme = defaultThemes[0];
        if (defaultTheme) {
          setCurrentTheme(defaultTheme);
          setSavedTheme(defaultTheme);
          applyTheme(defaultTheme);
          cacheTheme(defaultTheme);
          setThemes(defaultThemes);
        }
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      // If we have cached theme, use it
      const cached = getCachedTheme();
      if (cached) {
        setCurrentTheme(cached);
        setSavedTheme(cached);
        applyTheme(cached);
      } else {
        // Use default theme as fallback
        const defaultTheme = defaultThemes[0];
        if (defaultTheme) {
          setCurrentTheme(defaultTheme);
          setSavedTheme(defaultTheme);
          applyTheme(defaultTheme);
          cacheTheme(defaultTheme);
          setThemes(defaultThemes);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [applyTheme]);

  const setActiveTheme = async (themeId: string) => {
    try {
      const themeToActivate = themes.find(t => t.id === themeId);
      
      const { error } = await supabase
        .from('themes')
        .update({ is_active: true })
        .eq('id', themeId);

      if (error) throw error;

      // Immediately cache and apply the new theme
      if (themeToActivate) {
        const updatedTheme = { ...themeToActivate, isActive: true };
        cacheTheme(updatedTheme);
        applyTheme(updatedTheme);
        setCurrentTheme(updatedTheme);
        setSavedTheme(updatedTheme);
      }

      await fetchThemes();
      setIsPreviewMode(false);
    } catch (error) {
      console.error('Error setting active theme:', error);
    }
  };

  const previewTheme = (theme: Theme) => {
    if (!isPreviewMode && currentTheme) {
      setSavedTheme(currentTheme);
    }
    setIsPreviewMode(true);
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  const resetPreview = () => {
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
    setIsPreviewMode(false);
  };

  const refreshThemes = async () => {
    setIsLoading(true);
    await fetchThemes();
  };

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themes,
        isLoading,
        isThemeReady,
        setActiveTheme,
        previewTheme,
        resetPreview,
        isPreviewMode,
        refreshThemes
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
