import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Theme, defaultThemes } from '@/lib/themes';

const THEME_CACHE_KEY = 'furniture-active-theme';

interface ThemeContextType {
  currentTheme: Theme | null;
  themes: Theme[];
  isLoading: boolean;
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
};

// Initialize theme immediately (called before React mounts)
export const initializeTheme = () => {
  const cached = getCachedTheme();
  if (cached) {
    applyThemeToDocument(cached);
    return cached;
  }
  // Fallback to warm-furniture from defaults
  const fallback = defaultThemes.find(t => t.slug === 'warm-furniture');
  if (fallback) {
    applyThemeToDocument(fallback);
    return fallback;
  }
  return null;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with cached theme immediately
  const [themes, setThemes] = useState<Theme[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(() => getCachedTheme());
  const [savedTheme, setSavedTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const applyTheme = useCallback((theme: Theme) => {
    applyThemeToDocument(theme);
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
          cacheTheme(active); // Cache for next page load
        }
      } else {
        // Seed default themes if none exist
        await seedDefaultThemes();
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      // Fallback to default themes
      setThemes(defaultThemes);
      const warmFurniture = defaultThemes.find(t => t.slug === 'warm-furniture');
      if (warmFurniture) {
        setCurrentTheme(warmFurniture);
        setSavedTheme(warmFurniture);
        applyTheme(warmFurniture);
        cacheTheme(warmFurniture);
      }
    } finally {
      setIsLoading(false);
    }
  }, [applyTheme]);

  const seedDefaultThemes = async () => {
    try {
      for (const theme of defaultThemes) {
        const { error } = await supabase
          .from('themes')
          .insert({
            name: theme.name,
            slug: theme.slug,
            color_palette: JSON.parse(JSON.stringify(theme.colorPalette)),
            typography: JSON.parse(JSON.stringify(theme.typography)),
            component_styles: JSON.parse(JSON.stringify(theme.componentStyles)),
            layout_settings: JSON.parse(JSON.stringify(theme.layoutSettings)),
            is_active: theme.slug === 'warm-furniture',
            is_dark: theme.isDark
          });
        
        if (error) console.error('Error inserting theme:', theme.name, error);
      }

      await fetchThemes();
    } catch (error) {
      console.error('Error seeding themes:', error);
    }
  };

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
