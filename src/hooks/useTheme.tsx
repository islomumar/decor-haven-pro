import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Theme, defaultThemes } from '@/lib/themes';

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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [savedTheme, setSavedTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const applyTheme = useCallback((theme: Theme) => {
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
      }
    } finally {
      setIsLoading(false);
    }
  }, [applyTheme]);

  const seedDefaultThemes = async () => {
    try {
      const themesToInsert = defaultThemes.map((theme) => ({
        name: theme.name,
        slug: theme.slug,
        color_palette: theme.colorPalette as unknown as Record<string, unknown>,
        typography: theme.typography as unknown as Record<string, unknown>,
        component_styles: theme.componentStyles as unknown as Record<string, unknown>,
        layout_settings: theme.layoutSettings as unknown as Record<string, unknown>,
        is_active: theme.slug === 'warm-furniture',
        is_dark: theme.isDark
      }));

      const { error } = await supabase
        .from('themes')
        .insert(themesToInsert);

      if (error) throw error;

      await fetchThemes();
    } catch (error) {
      console.error('Error seeding themes:', error);
    }
  };

  const setActiveTheme = async (themeId: string) => {
    try {
      const { error } = await supabase
        .from('themes')
        .update({ is_active: true })
        .eq('id', themeId);

      if (error) throw error;

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
