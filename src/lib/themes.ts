export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  warmCream: string;
  warmBeige: string;
  warmBrown: string;
  darkWood: string;
  goldAccent: string;
  sageGreen: string;
}

export interface ThemeTypography {
  fontSans: string;
  fontSerif: string;
  fontHeading: string;
}

export interface ThemeComponentStyles {
  borderRadius: string;
  buttonRadius: string;
  cardRadius: string;
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
}

export interface ThemeLayoutSettings {
  containerMaxWidth: string;
  sectionSpacing: string;
  cardPadding: string;
}

export interface Theme {
  id?: string;
  name: string;
  slug: string;
  colorPalette: ThemeColors;
  typography: ThemeTypography;
  componentStyles: ThemeComponentStyles;
  layoutSettings: ThemeLayoutSettings;
  isActive?: boolean;
  isDark: boolean;
}

// 25+ Professional Furniture Website Themes
export const defaultThemes: Theme[] = [
  {
    name: "Modern Light",
    slug: "modern-light",
    isDark: false,
    colorPalette: {
      background: "0 0% 100%",
      foreground: "222 47% 11%",
      card: "0 0% 100%",
      cardForeground: "222 47% 11%",
      popover: "0 0% 100%",
      popoverForeground: "222 47% 11%",
      primary: "222 47% 11%",
      primaryForeground: "0 0% 100%",
      secondary: "210 40% 96%",
      secondaryForeground: "222 47% 11%",
      muted: "210 40% 96%",
      mutedForeground: "215 16% 47%",
      accent: "210 40% 96%",
      accentForeground: "222 47% 11%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      border: "214 32% 91%",
      input: "214 32% 91%",
      ring: "222 47% 11%",
      warmCream: "0 0% 98%",
      warmBeige: "210 40% 96%",
      warmBrown: "222 47% 11%",
      darkWood: "222 47% 11%",
      goldAccent: "45 93% 47%",
      sageGreen: "142 76% 36%"
    },
    typography: {
      fontSans: "'Inter', system-ui, sans-serif",
      fontSerif: "'Playfair Display', Georgia, serif",
      fontHeading: "'Playfair Display', Georgia, serif"
    },
    componentStyles: {
      borderRadius: "0.5rem",
      buttonRadius: "0.375rem",
      cardRadius: "0.75rem",
      shadowSm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      shadowMd: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      shadowLg: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
    },
    layoutSettings: {
      containerMaxWidth: "1280px",
      sectionSpacing: "4rem",
      cardPadding: "1.5rem"
    }
  },
  {
    name: "Modern Dark",
    slug: "modern-dark",
    isDark: true,
    colorPalette: {
      background: "222 47% 11%",
      foreground: "210 40% 98%",
      card: "222 47% 15%",
      cardForeground: "210 40% 98%",
      popover: "222 47% 15%",
      popoverForeground: "210 40% 98%",
      primary: "210 40% 98%",
      primaryForeground: "222 47% 11%",
      secondary: "217 33% 17%",
      secondaryForeground: "210 40% 98%",
      muted: "217 33% 17%",
      mutedForeground: "215 20% 65%",
      accent: "217 33% 17%",
      accentForeground: "210 40% 98%",
      destructive: "0 62% 30%",
      destructiveForeground: "0 0% 100%",
      border: "217 33% 17%",
      input: "217 33% 17%",
      ring: "210 40% 98%",
      warmCream: "222 47% 15%",
      warmBeige: "217 33% 20%",
      warmBrown: "210 40% 70%",
      darkWood: "210 40% 85%",
      goldAccent: "45 93% 47%",
      sageGreen: "142 76% 46%"
    },
    typography: {
      fontSans: "'Inter', system-ui, sans-serif",
      fontSerif: "'Playfair Display', Georgia, serif",
      fontHeading: "'Playfair Display', Georgia, serif"
    },
    componentStyles: {
      borderRadius: "0.5rem",
      buttonRadius: "0.375rem",
      cardRadius: "0.75rem",
      shadowSm: "0 1px 2px 0 rgb(0 0 0 / 0.3)",
      shadowMd: "0 4px 6px -1px rgb(0 0 0 / 0.4)",
      shadowLg: "0 10px 15px -3px rgb(0 0 0 / 0.5)"
    },
    layoutSettings: {
      containerMaxWidth: "1280px",
      sectionSpacing: "4rem",
      cardPadding: "1.5rem"
    }
  },
  {
    name: "Warm Furniture",
    slug: "warm-furniture",
    isDark: false,
    colorPalette: {
      background: "30 20% 96%",
      foreground: "25 30% 20%",
      card: "30 25% 98%",
      cardForeground: "25 30% 20%",
      popover: "30 25% 98%",
      popoverForeground: "25 30% 20%",
      primary: "30 25% 35%",
      primaryForeground: "30 20% 96%",
      secondary: "35 20% 90%",
      secondaryForeground: "25 30% 25%",
      muted: "30 15% 92%",
      mutedForeground: "25 15% 45%",
      accent: "35 40% 55%",
      accentForeground: "30 20% 96%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      border: "30 20% 88%",
      input: "30 20% 88%",
      ring: "30 25% 35%",
      warmCream: "35 30% 95%",
      warmBeige: "30 25% 88%",
      warmBrown: "25 30% 45%",
      darkWood: "25 35% 22%",
      goldAccent: "40 50% 60%",
      sageGreen: "90 15% 45%"
    },
    typography: {
      fontSans: "'Inter', system-ui, sans-serif",
      fontSerif: "'Playfair Display', Georgia, serif",
      fontHeading: "'Playfair Display', Georgia, serif"
    },
    componentStyles: {
      borderRadius: "0.75rem",
      buttonRadius: "0.5rem",
      cardRadius: "1rem",
      shadowSm: "0 2px 4px -1px hsl(25 30% 45% / 0.1)",
      shadowMd: "0 4px 20px -4px hsl(25 30% 45% / 0.15)",
      shadowLg: "0 10px 40px -10px hsl(25 30% 45% / 0.2)"
    },
    layoutSettings: {
      containerMaxWidth: "1280px",
      sectionSpacing: "4rem",
      cardPadding: "1.5rem"
    }
  },
  {
    name: "Luxury Wood",
    slug: "luxury-wood",
    isDark: false,
    colorPalette: {
      background: "35 25% 94%",
      foreground: "20 40% 15%",
      card: "35 30% 97%",
      cardForeground: "20 40% 15%",
      popover: "35 30% 97%",
      popoverForeground: "20 40% 15%",
      primary: "20 50% 30%",
      primaryForeground: "35 25% 94%",
      secondary: "30 25% 88%",
      secondaryForeground: "20 40% 20%",
      muted: "30 20% 90%",
      mutedForeground: "20 20% 50%",
      accent: "38 60% 45%",
      accentForeground: "35 25% 94%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      border: "30 20% 85%",
      input: "30 20% 85%",
      ring: "20 50% 30%",
      warmCream: "35 30% 95%",
      warmBeige: "30 25% 85%",
      warmBrown: "20 50% 30%",
      darkWood: "20 55% 18%",
      goldAccent: "38 60% 45%",
      sageGreen: "85 20% 40%"
    },
    typography: {
      fontSans: "'Lora', Georgia, serif",
      fontSerif: "'Cormorant Garamond', Georgia, serif",
      fontHeading: "'Cormorant Garamond', Georgia, serif"
    },
    componentStyles: {
      borderRadius: "0.25rem",
      buttonRadius: "0.125rem",
      cardRadius: "0.375rem",
      shadowSm: "0 2px 4px hsl(20 50% 30% / 0.08)",
      shadowMd: "0 6px 16px hsl(20 50% 30% / 0.12)",
      shadowLg: "0 12px 32px hsl(20 50% 30% / 0.16)"
    },
    layoutSettings: {
      containerMaxWidth: "1200px",
      sectionSpacing: "5rem",
      cardPadding: "2rem"
    }
  },
  {
    name: "Minimal White",
    slug: "minimal-white",
    isDark: false,
    colorPalette: {
      background: "0 0% 100%",
      foreground: "0 0% 10%",
      card: "0 0% 100%",
      cardForeground: "0 0% 10%",
      popover: "0 0% 100%",
      popoverForeground: "0 0% 10%",
      primary: "0 0% 10%",
      primaryForeground: "0 0% 100%",
      secondary: "0 0% 96%",
      secondaryForeground: "0 0% 15%",
      muted: "0 0% 96%",
      mutedForeground: "0 0% 45%",
      accent: "0 0% 90%",
      accentForeground: "0 0% 10%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      border: "0 0% 92%",
      input: "0 0% 92%",
      ring: "0 0% 10%",
      warmCream: "0 0% 98%",
      warmBeige: "0 0% 95%",
      warmBrown: "0 0% 30%",
      darkWood: "0 0% 15%",
      goldAccent: "0 0% 50%",
      sageGreen: "0 0% 40%"
    },
    typography: {
      fontSans: "'Helvetica Neue', Arial, sans-serif",
      fontSerif: "'Times New Roman', Georgia, serif",
      fontHeading: "'Helvetica Neue', Arial, sans-serif"
    },
    componentStyles: {
      borderRadius: "0",
      buttonRadius: "0",
      cardRadius: "0",
      shadowSm: "none",
      shadowMd: "0 1px 0 hsl(0 0% 0% / 0.05)",
      shadowLg: "0 2px 0 hsl(0 0% 0% / 0.08)"
    },
    layoutSettings: {
      containerMaxWidth: "1400px",
      sectionSpacing: "6rem",
      cardPadding: "2rem"
    }
  },
  {
    name: "Scandinavian",
    slug: "scandinavian",
    isDark: false,
    colorPalette: {
      background: "40 33% 98%",
      foreground: "210 11% 15%",
      card: "40 40% 99%",
      cardForeground: "210 11% 15%",
      popover: "40 40% 99%",
      popoverForeground: "210 11% 15%",
      primary: "210 11% 25%",
      primaryForeground: "40 33% 98%",
      secondary: "40 20% 94%",
      secondaryForeground: "210 11% 20%",
      muted: "40 15% 92%",
      mutedForeground: "210 8% 50%",
      accent: "185 25% 50%",
      accentForeground: "40 33% 98%",
      destructive: "0 70% 55%",
      destructiveForeground: "0 0% 100%",
      border: "40 15% 88%",
      input: "40 15% 88%",
      ring: "210 11% 25%",
      warmCream: "40 40% 97%",
      warmBeige: "40 25% 90%",
      warmBrown: "30 15% 40%",
      darkWood: "30 20% 25%",
      goldAccent: "45 50% 55%",
      sageGreen: "150 20% 50%"
    },
    typography: {
      fontSans: "'Nunito Sans', system-ui, sans-serif",
      fontSerif: "'Libre Baskerville', Georgia, serif",
      fontHeading: "'Nunito Sans', system-ui, sans-serif"
    },
    componentStyles: {
      borderRadius: "1rem",
      buttonRadius: "0.75rem",
      cardRadius: "1.25rem",
      shadowSm: "0 2px 8px hsl(210 11% 15% / 0.04)",
      shadowMd: "0 4px 16px hsl(210 11% 15% / 0.06)",
      shadowLg: "0 8px 32px hsl(210 11% 15% / 0.08)"
    },
    layoutSettings: {
      containerMaxWidth: "1200px",
      sectionSpacing: "5rem",
      cardPadding: "1.75rem"
    }
  },
  {
    name: "Industrial",
    slug: "industrial",
    isDark: false,
    colorPalette: {
      background: "30 5% 92%",
      foreground: "0 0% 15%",
      card: "30 8% 95%",
      cardForeground: "0 0% 15%",
      popover: "30 8% 95%",
      popoverForeground: "0 0% 15%",
      primary: "25 20% 25%",
      primaryForeground: "30 5% 92%",
      secondary: "30 10% 85%",
      secondaryForeground: "0 0% 20%",
      muted: "30 8% 88%",
      mutedForeground: "0 0% 45%",
      accent: "25 80% 45%",
      accentForeground: "30 5% 92%",
      destructive: "0 75% 50%",
      destructiveForeground: "0 0% 100%",
      border: "30 10% 80%",
      input: "30 10% 80%",
      ring: "25 20% 25%",
      warmCream: "30 10% 93%",
      warmBeige: "30 15% 85%",
      warmBrown: "25 20% 35%",
      darkWood: "25 25% 20%",
      goldAccent: "35 70% 50%",
      sageGreen: "80 10% 45%"
    },
    typography: {
      fontSans: "'Roboto', system-ui, sans-serif",
      fontSerif: "'Roboto Slab', Georgia, serif",
      fontHeading: "'Roboto Condensed', Arial, sans-serif"
    },
    componentStyles: {
      borderRadius: "0.25rem",
      buttonRadius: "0.125rem",
      cardRadius: "0.375rem",
      shadowSm: "0 1px 3px hsl(0 0% 0% / 0.12)",
      shadowMd: "0 3px 8px hsl(0 0% 0% / 0.15)",
      shadowLg: "0 6px 16px hsl(0 0% 0% / 0.18)"
    },
    layoutSettings: {
      containerMaxWidth: "1400px",
      sectionSpacing: "4rem",
      cardPadding: "1.5rem"
    }
  },
  {
    name: "Premium Gold",
    slug: "premium-gold",
    isDark: false,
    colorPalette: {
      background: "40 30% 97%",
      foreground: "20 30% 15%",
      card: "40 35% 99%",
      cardForeground: "20 30% 15%",
      popover: "40 35% 99%",
      popoverForeground: "20 30% 15%",
      primary: "42 70% 45%",
      primaryForeground: "0 0% 100%",
      secondary: "40 25% 92%",
      secondaryForeground: "20 30% 20%",
      muted: "40 20% 90%",
      mutedForeground: "20 15% 50%",
      accent: "42 70% 45%",
      accentForeground: "0 0% 100%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      border: "40 25% 88%",
      input: "40 25% 88%",
      ring: "42 70% 45%",
      warmCream: "40 35% 96%",
      warmBeige: "40 30% 90%",
      warmBrown: "30 25% 40%",
      darkWood: "25 30% 22%",
      goldAccent: "42 70% 45%",
      sageGreen: "80 15% 45%"
    },
    typography: {
      fontSans: "'Montserrat', system-ui, sans-serif",
      fontSerif: "'Cinzel', Georgia, serif",
      fontHeading: "'Cinzel', Georgia, serif"
    },
    componentStyles: {
      borderRadius: "0.5rem",
      buttonRadius: "0.25rem",
      cardRadius: "0.75rem",
      shadowSm: "0 2px 6px hsl(42 70% 45% / 0.1)",
      shadowMd: "0 4px 12px hsl(42 70% 45% / 0.15)",
      shadowLg: "0 8px 24px hsl(42 70% 45% / 0.2)"
    },
    layoutSettings: {
      containerMaxWidth: "1280px",
      sectionSpacing: "5rem",
      cardPadding: "2rem"
    }
  },
  {
    name: "Classic Brown",
    slug: "classic-brown",
    isDark: false,
    colorPalette: {
      background: "30 20% 95%",
      foreground: "20 35% 18%",
      card: "30 25% 98%",
      cardForeground: "20 35% 18%",
      popover: "30 25% 98%",
      popoverForeground: "20 35% 18%",
      primary: "20 45% 28%",
      primaryForeground: "30 20% 95%",
      secondary: "25 20% 88%",
      secondaryForeground: "20 35% 22%",
      muted: "25 15% 90%",
      mutedForeground: "20 20% 48%",
      accent: "25 55% 40%",
      accentForeground: "30 20% 95%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      border: "25 18% 85%",
      input: "25 18% 85%",
      ring: "20 45% 28%",
      warmCream: "30 25% 96%",
      warmBeige: "25 22% 88%",
      warmBrown: "20 45% 28%",
      darkWood: "20 50% 18%",
      goldAccent: "35 55% 50%",
      sageGreen: "85 18% 42%"
    },
    typography: {
      fontSans: "'Source Sans Pro', system-ui, sans-serif",
      fontSerif: "'Merriweather', Georgia, serif",
      fontHeading: "'Merriweather', Georgia, serif"
    },
    componentStyles: {
      borderRadius: "0.5rem",
      buttonRadius: "0.375rem",
      cardRadius: "0.625rem",
      shadowSm: "0 2px 4px hsl(20 45% 28% / 0.08)",
      shadowMd: "0 4px 12px hsl(20 45% 28% / 0.12)",
      shadowLg: "0 8px 24px hsl(20 45% 28% / 0.16)"
    },
    layoutSettings: {
      containerMaxWidth: "1240px",
      sectionSpacing: "4.5rem",
      cardPadding: "1.75rem"
    }
  },
  {
    name: "Neutral Gray",
    slug: "neutral-gray",
    isDark: false,
    colorPalette: {
      background: "220 15% 97%",
      foreground: "220 20% 18%",
      card: "220 18% 99%",
      cardForeground: "220 20% 18%",
      popover: "220 18% 99%",
      popoverForeground: "220 20% 18%",
      primary: "220 15% 35%",
      primaryForeground: "220 15% 97%",
      secondary: "220 12% 92%",
      secondaryForeground: "220 20% 22%",
      muted: "220 10% 90%",
      mutedForeground: "220 12% 50%",
      accent: "220 20% 55%",
      accentForeground: "220 15% 97%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      border: "220 12% 88%",
      input: "220 12% 88%",
      ring: "220 15% 35%",
      warmCream: "220 15% 96%",
      warmBeige: "220 12% 90%",
      warmBrown: "220 15% 40%",
      darkWood: "220 20% 22%",
      goldAccent: "45 40% 55%",
      sageGreen: "150 15% 48%"
    },
    typography: {
      fontSans: "'Open Sans', system-ui, sans-serif",
      fontSerif: "'Lora', Georgia, serif",
      fontHeading: "'Open Sans', system-ui, sans-serif"
    },
    componentStyles: {
      borderRadius: "0.625rem",
      buttonRadius: "0.5rem",
      cardRadius: "0.875rem",
      shadowSm: "0 1px 3px hsl(220 20% 18% / 0.06)",
      shadowMd: "0 4px 10px hsl(220 20% 18% / 0.08)",
      shadowLg: "0 8px 20px hsl(220 20% 18% / 0.1)"
    },
    layoutSettings: {
      containerMaxWidth: "1320px",
      sectionSpacing: "4rem",
      cardPadding: "1.5rem"
    }
  },
  {
    name: "Soft Beige",
    slug: "soft-beige",
    isDark: false,
    colorPalette: {
      background: "35 35% 96%",
      foreground: "30 25% 22%",
      card: "35 40% 98%",
      cardForeground: "30 25% 22%",
      popover: "35 40% 98%",
      popoverForeground: "30 25% 22%",
      primary: "30 30% 38%",
      primaryForeground: "35 35% 96%",
      secondary: "35 28% 90%",
      secondaryForeground: "30 25% 25%",
      muted: "35 22% 88%",
      mutedForeground: "30 18% 48%",
      accent: "28 45% 52%",
      accentForeground: "35 35% 96%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      border: "35 25% 85%",
      input: "35 25% 85%",
      ring: "30 30% 38%",
      warmCream: "35 40% 97%",
      warmBeige: "35 30% 88%",
      warmBrown: "30 30% 42%",
      darkWood: "28 35% 20%",
      goldAccent: "40 55% 55%",
      sageGreen: "95 18% 48%"
    },
    typography: {
      fontSans: "'Poppins', system-ui, sans-serif",
      fontSerif: "'Crimson Text', Georgia, serif",
      fontHeading: "'Crimson Text', Georgia, serif"
    },
    componentStyles: {
      borderRadius: "0.875rem",
      buttonRadius: "0.625rem",
      cardRadius: "1.125rem",
      shadowSm: "0 2px 5px hsl(30 25% 22% / 0.06)",
      shadowMd: "0 5px 15px hsl(30 25% 22% / 0.08)",
      shadowLg: "0 10px 30px hsl(30 25% 22% / 0.1)"
    },
    layoutSettings: {
      containerMaxWidth: "1260px",
      sectionSpacing: "4.5rem",
      cardPadding: "1.75rem"
    }
  },
  {
    name: "Earth Tones",
    slug: "earth-tones",
    isDark: false,
    colorPalette: {
      background: "45 25% 94%",
      foreground: "25 35% 18%",
      card: "45 30% 97%",
      cardForeground: "25 35% 18%",
      popover: "45 30% 97%",
      popoverForeground: "25 35% 18%",
      primary: "25 45% 32%",
      primaryForeground: "45 25% 94%",
      secondary: "40 22% 88%",
      secondaryForeground: "25 35% 22%",
      muted: "40 18% 86%",
      mutedForeground: "25 20% 48%",
      accent: "80 30% 42%",
      accentForeground: "45 25% 94%",
      destructive: "0 75% 55%",
      destructiveForeground: "0 0% 100%",
      border: "40 20% 82%",
      input: "40 20% 82%",
      ring: "25 45% 32%",
      warmCream: "45 30% 95%",
      warmBeige: "40 25% 85%",
      warmBrown: "25 45% 32%",
      darkWood: "25 50% 18%",
      goldAccent: "42 55% 52%",
      sageGreen: "80 30% 42%"
    },
    typography: {
      fontSans: "'Cabin', system-ui, sans-serif",
      fontSerif: "'Bitter', Georgia, serif",
      fontHeading: "'Bitter', Georgia, serif"
    },
    componentStyles: {
      borderRadius: "0.625rem",
      buttonRadius: "0.5rem",
      cardRadius: "0.875rem",
      shadowSm: "0 2px 4px hsl(25 45% 32% / 0.08)",
      shadowMd: "0 4px 12px hsl(25 45% 32% / 0.12)",
      shadowLg: "0 8px 24px hsl(25 45% 32% / 0.15)"
    },
    layoutSettings: {
      containerMaxWidth: "1280px",
      sectionSpacing: "4.5rem",
      cardPadding: "1.625rem"
    }
  },
  {
    name: "Dark Luxury",
    slug: "dark-luxury",
    isDark: true,
    colorPalette: {
      background: "20 20% 8%",
      foreground: "35 20% 92%",
      card: "20 18% 12%",
      cardForeground: "35 20% 92%",
      popover: "20 18% 12%",
      popoverForeground: "35 20% 92%",
      primary: "42 65% 50%",
      primaryForeground: "20 20% 8%",
      secondary: "20 15% 18%",
      secondaryForeground: "35 20% 88%",
      muted: "20 12% 16%",
      mutedForeground: "35 12% 60%",
      accent: "42 65% 50%",
      accentForeground: "20 20% 8%",
      destructive: "0 60% 40%",
      destructiveForeground: "0 0% 100%",
      border: "20 12% 20%",
      input: "20 12% 20%",
      ring: "42 65% 50%",
      warmCream: "20 15% 15%",
      warmBeige: "20 12% 22%",
      warmBrown: "35 25% 60%",
      darkWood: "35 20% 75%",
      goldAccent: "42 65% 50%",
      sageGreen: "85 20% 50%"
    },
    typography: {
      fontSans: "'Raleway', system-ui, sans-serif",
      fontSerif: "'Playfair Display', Georgia, serif",
      fontHeading: "'Playfair Display', Georgia, serif"
    },
    componentStyles: {
      borderRadius: "0.375rem",
      buttonRadius: "0.25rem",
      cardRadius: "0.5rem",
      shadowSm: "0 2px 8px hsl(42 65% 50% / 0.08)",
      shadowMd: "0 4px 16px hsl(42 65% 50% / 0.12)",
      shadowLg: "0 8px 32px hsl(42 65% 50% / 0.16)"
    },
    layoutSettings: {
      containerMaxWidth: "1200px",
      sectionSpacing: "5rem",
      cardPadding: "2rem"
    }
  },
  {
    name: "Bright Showroom",
    slug: "bright-showroom",
    isDark: false,
    colorPalette: {
      background: "0 0% 100%",
      foreground: "0 0% 12%",
      card: "0 0% 100%",
      cardForeground: "0 0% 12%",
      popover: "0 0% 100%",
      popoverForeground: "0 0% 12%",
      primary: "210 100% 50%",
      primaryForeground: "0 0% 100%",
      secondary: "210 20% 96%",
      secondaryForeground: "0 0% 15%",
      muted: "210 15% 94%",
      mutedForeground: "0 0% 45%",
      accent: "210 100% 50%",
      accentForeground: "0 0% 100%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      border: "210 15% 90%",
      input: "210 15% 90%",
      ring: "210 100% 50%",
      warmCream: "0 0% 99%",
      warmBeige: "210 15% 95%",
      warmBrown: "210 30% 40%",
      darkWood: "210 40% 20%",
      goldAccent: "45 100% 50%",
      sageGreen: "142 70% 45%"
    },
    typography: {
      fontSans: "'Rubik', system-ui, sans-serif",
      fontSerif: "'Domine', Georgia, serif",
      fontHeading: "'Rubik', system-ui, sans-serif"
    },
    componentStyles: {
      borderRadius: "0.75rem",
      buttonRadius: "0.5rem",
      cardRadius: "1rem",
      shadowSm: "0 1px 3px hsl(210 100% 50% / 0.08)",
      shadowMd: "0 4px 12px hsl(210 100% 50% / 0.1)",
      shadowLg: "0 8px 24px hsl(210 100% 50% / 0.12)"
    },
    layoutSettings: {
      containerMaxWidth: "1400px",
      sectionSpacing: "4rem",
      cardPadding: "1.5rem"
    }
  },
  {
    name: "Corporate",
    slug: "corporate",
    isDark: false,
    colorPalette: {
      background: "210 20% 98%",
      foreground: "210 30% 15%",
      card: "0 0% 100%",
      cardForeground: "210 30% 15%",
      popover: "0 0% 100%",
      popoverForeground: "210 30% 15%",
      primary: "210 75% 40%",
      primaryForeground: "0 0% 100%",
      secondary: "210 20% 94%",
      secondaryForeground: "210 30% 18%",
      muted: "210 15% 92%",
      mutedForeground: "210 20% 50%",
      accent: "210 75% 40%",
      accentForeground: "0 0% 100%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      border: "210 18% 88%",
      input: "210 18% 88%",
      ring: "210 75% 40%",
      warmCream: "210 18% 97%",
      warmBeige: "210 15% 92%",
      warmBrown: "210 35% 38%",
      darkWood: "210 40% 22%",
      goldAccent: "45 80% 52%",
      sageGreen: "160 50% 42%"
    },
    typography: {
      fontSans: "'IBM Plex Sans', system-ui, sans-serif",
      fontSerif: "'IBM Plex Serif', Georgia, serif",
      fontHeading: "'IBM Plex Sans', system-ui, sans-serif"
    },
    componentStyles: {
      borderRadius: "0.375rem",
      buttonRadius: "0.25rem",
      cardRadius: "0.5rem",
      shadowSm: "0 1px 2px hsl(210 30% 15% / 0.05)",
      shadowMd: "0 2px 8px hsl(210 30% 15% / 0.08)",
      shadowLg: "0 4px 16px hsl(210 30% 15% / 0.1)"
    },
    layoutSettings: {
      containerMaxWidth: "1280px",
      sectionSpacing: "4rem",
      cardPadding: "1.5rem"
    }
  },
  {
    name: "Elegant",
    slug: "elegant",
    isDark: false,
    colorPalette: {
      background: "30 15% 97%",
      foreground: "260 20% 18%",
      card: "30 20% 99%",
      cardForeground: "260 20% 18%",
      popover: "30 20% 99%",
      popoverForeground: "260 20% 18%",
      primary: "260 35% 35%",
      primaryForeground: "30 15% 97%",
      secondary: "30 18% 92%",
      secondaryForeground: "260 20% 22%",
      muted: "30 12% 90%",
      mutedForeground: "260 12% 48%",
      accent: "330 50% 55%",
      accentForeground: "30 15% 97%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      border: "30 15% 88%",
      input: "30 15% 88%",
      ring: "260 35% 35%",
      warmCream: "30 18% 96%",
      warmBeige: "30 15% 90%",
      warmBrown: "260 25% 38%",
      darkWood: "260 30% 20%",
      goldAccent: "38 65% 55%",
      sageGreen: "150 25% 48%"
    },
    typography: {
      fontSans: "'Josefin Sans', system-ui, sans-serif",
      fontSerif: "'Cormorant', Georgia, serif",
      fontHeading: "'Cormorant', Georgia, serif"
    },
    componentStyles: {
      borderRadius: "0.5rem",
      buttonRadius: "0.375rem",
      cardRadius: "0.75rem",
      shadowSm: "0 2px 6px hsl(260 35% 35% / 0.06)",
      shadowMd: "0 4px 14px hsl(260 35% 35% / 0.08)",
      shadowLg: "0 8px 28px hsl(260 35% 35% / 0.1)"
    },
    layoutSettings: {
      containerMaxWidth: "1220px",
      sectionSpacing: "5rem",
      cardPadding: "1.875rem"
    }
  },
  {
    name: "Cozy Home",
    slug: "cozy-home",
    isDark: false,
    colorPalette: {
      background: "25 30% 95%",
      foreground: "20 40% 18%",
      card: "25 35% 98%",
      cardForeground: "20 40% 18%",
      popover: "25 35% 98%",
      popoverForeground: "20 40% 18%",
      primary: "15 55% 42%",
      primaryForeground: "25 30% 95%",
      secondary: "25 25% 88%",
      secondaryForeground: "20 40% 22%",
      muted: "25 20% 86%",
      mutedForeground: "20 25% 48%",
      accent: "15 55% 42%",
      accentForeground: "25 30% 95%",
      destructive: "0 70% 55%",
      destructiveForeground: "0 0% 100%",
      border: "25 22% 82%",
      input: "25 22% 82%",
      ring: "15 55% 42%",
      warmCream: "25 35% 96%",
      warmBeige: "25 28% 86%",
      warmBrown: "15 55% 42%",
      darkWood: "15 60% 22%",
      goldAccent: "38 60% 55%",
      sageGreen: "100 25% 45%"
    },
    typography: {
      fontSans: "'Quicksand', system-ui, sans-serif",
      fontSerif: "'Cardo', Georgia, serif",
      fontHeading: "'Cardo', Georgia, serif"
    },
    componentStyles: {
      borderRadius: "1rem",
      buttonRadius: "0.75rem",
      cardRadius: "1.25rem",
      shadowSm: "0 2px 8px hsl(15 55% 42% / 0.06)",
      shadowMd: "0 5px 18px hsl(15 55% 42% / 0.08)",
      shadowLg: "0 10px 36px hsl(15 55% 42% / 0.1)"
    },
    layoutSettings: {
      containerMaxWidth: "1200px",
      sectionSpacing: "4.5rem",
      cardPadding: "1.75rem"
    }
  },
  {
    name: "Natural Wood",
    slug: "natural-wood",
    isDark: false,
    colorPalette: {
      background: "38 25% 95%",
      foreground: "25 45% 16%",
      card: "38 30% 98%",
      cardForeground: "25 45% 16%",
      popover: "38 30% 98%",
      popoverForeground: "25 45% 16%",
      primary: "25 50% 32%",
      primaryForeground: "38 25% 95%",
      secondary: "35 22% 88%",
      secondaryForeground: "25 45% 20%",
      muted: "35 18% 86%",
      mutedForeground: "25 28% 48%",
      accent: "95 35% 45%",
      accentForeground: "38 25% 95%",
      destructive: "0 75% 55%",
      destructiveForeground: "0 0% 100%",
      border: "35 20% 82%",
      input: "35 20% 82%",
      ring: "25 50% 32%",
      warmCream: "38 30% 96%",
      warmBeige: "35 25% 86%",
      warmBrown: "25 50% 32%",
      darkWood: "25 55% 18%",
      goldAccent: "40 55% 52%",
      sageGreen: "95 35% 45%"
    },
    typography: {
      fontSans: "'Karla', system-ui, sans-serif",
      fontSerif: "'Spectral', Georgia, serif",
      fontHeading: "'Spectral', Georgia, serif"
    },
    componentStyles: {
      borderRadius: "0.5rem",
      buttonRadius: "0.375rem",
      cardRadius: "0.75rem",
      shadowSm: "0 2px 5px hsl(25 50% 32% / 0.08)",
      shadowMd: "0 4px 14px hsl(25 50% 32% / 0.1)",
      shadowLg: "0 8px 28px hsl(25 50% 32% / 0.12)"
    },
    layoutSettings: {
      containerMaxWidth: "1260px",
      sectionSpacing: "4.5rem",
      cardPadding: "1.625rem"
    }
  },
  {
    name: "Modern Showroom",
    slug: "modern-showroom",
    isDark: false,
    colorPalette: {
      background: "0 0% 98%",
      foreground: "0 0% 8%",
      card: "0 0% 100%",
      cardForeground: "0 0% 8%",
      popover: "0 0% 100%",
      popoverForeground: "0 0% 8%",
      primary: "0 0% 15%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 94%",
      secondaryForeground: "0 0% 12%",
      muted: "0 0% 92%",
      mutedForeground: "0 0% 45%",
      accent: "25 85% 55%",
      accentForeground: "0 0% 100%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      border: "0 0% 90%",
      input: "0 0% 90%",
      ring: "0 0% 15%",
      warmCream: "0 0% 97%",
      warmBeige: "0 0% 93%",
      warmBrown: "0 0% 30%",
      darkWood: "0 0% 12%",
      goldAccent: "25 85% 55%",
      sageGreen: "160 40% 45%"
    },
    typography: {
      fontSans: "'DM Sans', system-ui, sans-serif",
      fontSerif: "'DM Serif Display', Georgia, serif",
      fontHeading: "'DM Serif Display', Georgia, serif"
    },
    componentStyles: {
      borderRadius: "0.25rem",
      buttonRadius: "0.125rem",
      cardRadius: "0.375rem",
      shadowSm: "0 1px 2px hsl(0 0% 0% / 0.04)",
      shadowMd: "0 4px 8px hsl(0 0% 0% / 0.06)",
      shadowLg: "0 8px 16px hsl(0 0% 0% / 0.08)"
    },
    layoutSettings: {
      containerMaxWidth: "1400px",
      sectionSpacing: "5rem",
      cardPadding: "1.5rem"
    }
  },
  {
    name: "High Contrast",
    slug: "high-contrast",
    isDark: false,
    colorPalette: {
      background: "0 0% 100%",
      foreground: "0 0% 0%",
      card: "0 0% 100%",
      cardForeground: "0 0% 0%",
      popover: "0 0% 100%",
      popoverForeground: "0 0% 0%",
      primary: "0 0% 0%",
      primaryForeground: "0 0% 100%",
      secondary: "0 0% 95%",
      secondaryForeground: "0 0% 0%",
      muted: "0 0% 92%",
      mutedForeground: "0 0% 30%",
      accent: "0 100% 50%",
      accentForeground: "0 0% 100%",
      destructive: "0 100% 50%",
      destructiveForeground: "0 0% 100%",
      border: "0 0% 0%",
      input: "0 0% 85%",
      ring: "0 0% 0%",
      warmCream: "0 0% 98%",
      warmBeige: "0 0% 92%",
      warmBrown: "0 0% 20%",
      darkWood: "0 0% 0%",
      goldAccent: "45 100% 50%",
      sageGreen: "120 100% 25%"
    },
    typography: {
      fontSans: "'Arial', system-ui, sans-serif",
      fontSerif: "'Georgia', serif",
      fontHeading: "'Arial Black', Arial, sans-serif"
    },
    componentStyles: {
      borderRadius: "0",
      buttonRadius: "0",
      cardRadius: "0",
      shadowSm: "none",
      shadowMd: "2px 2px 0 hsl(0 0% 0%)",
      shadowLg: "4px 4px 0 hsl(0 0% 0%)"
    },
    layoutSettings: {
      containerMaxWidth: "1200px",
      sectionSpacing: "4rem",
      cardPadding: "1.5rem"
    }
  },
  {
    name: "Calm Minimal",
    slug: "calm-minimal",
    isDark: false,
    colorPalette: {
      background: "200 20% 98%",
      foreground: "200 25% 18%",
      card: "200 25% 99%",
      cardForeground: "200 25% 18%",
      popover: "200 25% 99%",
      popoverForeground: "200 25% 18%",
      primary: "200 20% 35%",
      primaryForeground: "200 20% 98%",
      secondary: "200 15% 94%",
      secondaryForeground: "200 25% 22%",
      muted: "200 12% 92%",
      mutedForeground: "200 15% 50%",
      accent: "180 30% 50%",
      accentForeground: "200 20% 98%",
      destructive: "0 70% 55%",
      destructiveForeground: "0 0% 100%",
      border: "200 15% 90%",
      input: "200 15% 90%",
      ring: "200 20% 35%",
      warmCream: "200 20% 97%",
      warmBeige: "200 15% 92%",
      warmBrown: "200 20% 40%",
      darkWood: "200 25% 22%",
      goldAccent: "45 45% 55%",
      sageGreen: "160 30% 48%"
    },
    typography: {
      fontSans: "'Work Sans', system-ui, sans-serif",
      fontSerif: "'Literata', Georgia, serif",
      fontHeading: "'Work Sans', system-ui, sans-serif"
    },
    componentStyles: {
      borderRadius: "0.75rem",
      buttonRadius: "0.5rem",
      cardRadius: "1rem",
      shadowSm: "0 1px 4px hsl(200 25% 18% / 0.04)",
      shadowMd: "0 3px 10px hsl(200 25% 18% / 0.06)",
      shadowLg: "0 6px 20px hsl(200 25% 18% / 0.08)"
    },
    layoutSettings: {
      containerMaxWidth: "1180px",
      sectionSpacing: "5rem",
      cardPadding: "1.75rem"
    }
  },
  {
    name: "Stylish Dark",
    slug: "stylish-dark",
    isDark: true,
    colorPalette: {
      background: "240 15% 10%",
      foreground: "0 0% 95%",
      card: "240 12% 14%",
      cardForeground: "0 0% 95%",
      popover: "240 12% 14%",
      popoverForeground: "0 0% 95%",
      primary: "250 80% 65%",
      primaryForeground: "0 0% 100%",
      secondary: "240 10% 20%",
      secondaryForeground: "0 0% 90%",
      muted: "240 8% 18%",
      mutedForeground: "0 0% 60%",
      accent: "250 80% 65%",
      accentForeground: "0 0% 100%",
      destructive: "0 60% 45%",
      destructiveForeground: "0 0% 100%",
      border: "240 10% 22%",
      input: "240 10% 22%",
      ring: "250 80% 65%",
      warmCream: "240 10% 16%",
      warmBeige: "240 8% 22%",
      warmBrown: "0 0% 65%",
      darkWood: "0 0% 80%",
      goldAccent: "45 80% 60%",
      sageGreen: "160 50% 55%"
    },
    typography: {
      fontSans: "'Space Grotesk', system-ui, sans-serif",
      fontSerif: "'Fraunces', Georgia, serif",
      fontHeading: "'Space Grotesk', system-ui, sans-serif"
    },
    componentStyles: {
      borderRadius: "0.625rem",
      buttonRadius: "0.5rem",
      cardRadius: "0.875rem",
      shadowSm: "0 2px 6px hsl(250 80% 65% / 0.08)",
      shadowMd: "0 4px 14px hsl(250 80% 65% / 0.12)",
      shadowLg: "0 8px 28px hsl(250 80% 65% / 0.16)"
    },
    layoutSettings: {
      containerMaxWidth: "1280px",
      sectionSpacing: "4.5rem",
      cardPadding: "1.625rem"
    }
  },
  {
    name: "Soft Pastel",
    slug: "soft-pastel",
    isDark: false,
    colorPalette: {
      background: "340 30% 98%",
      foreground: "340 25% 20%",
      card: "340 35% 99%",
      cardForeground: "340 25% 20%",
      popover: "340 35% 99%",
      popoverForeground: "340 25% 20%",
      primary: "340 45% 55%",
      primaryForeground: "0 0% 100%",
      secondary: "200 35% 94%",
      secondaryForeground: "340 25% 25%",
      muted: "340 20% 92%",
      mutedForeground: "340 15% 50%",
      accent: "200 50% 60%",
      accentForeground: "0 0% 100%",
      destructive: "0 70% 55%",
      destructiveForeground: "0 0% 100%",
      border: "340 20% 90%",
      input: "340 20% 90%",
      ring: "340 45% 55%",
      warmCream: "340 30% 97%",
      warmBeige: "340 22% 92%",
      warmBrown: "340 30% 40%",
      darkWood: "340 35% 22%",
      goldAccent: "45 60% 60%",
      sageGreen: "160 40% 55%"
    },
    typography: {
      fontSans: "'Nunito', system-ui, sans-serif",
      fontSerif: "'Lora', Georgia, serif",
      fontHeading: "'Nunito', system-ui, sans-serif"
    },
    componentStyles: {
      borderRadius: "1.25rem",
      buttonRadius: "1rem",
      cardRadius: "1.5rem",
      shadowSm: "0 2px 8px hsl(340 45% 55% / 0.06)",
      shadowMd: "0 5px 18px hsl(340 45% 55% / 0.08)",
      shadowLg: "0 10px 36px hsl(340 45% 55% / 0.1)"
    },
    layoutSettings: {
      containerMaxWidth: "1200px",
      sectionSpacing: "4.5rem",
      cardPadding: "1.75rem"
    }
  },
  {
    name: "Bold Modern",
    slug: "bold-modern",
    isDark: false,
    colorPalette: {
      background: "0 0% 100%",
      foreground: "0 0% 8%",
      card: "0 0% 100%",
      cardForeground: "0 0% 8%",
      popover: "0 0% 100%",
      popoverForeground: "0 0% 8%",
      primary: "352 100% 55%",
      primaryForeground: "0 0% 100%",
      secondary: "0 0% 95%",
      secondaryForeground: "0 0% 12%",
      muted: "0 0% 92%",
      mutedForeground: "0 0% 45%",
      accent: "352 100% 55%",
      accentForeground: "0 0% 100%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      border: "0 0% 88%",
      input: "0 0% 88%",
      ring: "352 100% 55%",
      warmCream: "0 0% 98%",
      warmBeige: "0 0% 94%",
      warmBrown: "0 0% 30%",
      darkWood: "0 0% 10%",
      goldAccent: "45 100% 55%",
      sageGreen: "160 80% 45%"
    },
    typography: {
      fontSans: "'Bebas Neue', Impact, sans-serif",
      fontSerif: "'Abril Fatface', Georgia, serif",
      fontHeading: "'Bebas Neue', Impact, sans-serif"
    },
    componentStyles: {
      borderRadius: "0",
      buttonRadius: "0",
      cardRadius: "0",
      shadowSm: "4px 4px 0 hsl(352 100% 55% / 0.2)",
      shadowMd: "8px 8px 0 hsl(352 100% 55% / 0.25)",
      shadowLg: "12px 12px 0 hsl(352 100% 55% / 0.3)"
    },
    layoutSettings: {
      containerMaxWidth: "1400px",
      sectionSpacing: "4rem",
      cardPadding: "1.5rem"
    }
  },
  {
    name: "Custom Editable",
    slug: "custom-editable",
    isDark: false,
    colorPalette: {
      background: "30 20% 96%",
      foreground: "25 30% 20%",
      card: "30 25% 98%",
      cardForeground: "25 30% 20%",
      popover: "30 25% 98%",
      popoverForeground: "25 30% 20%",
      primary: "30 25% 35%",
      primaryForeground: "30 20% 96%",
      secondary: "35 20% 90%",
      secondaryForeground: "25 30% 25%",
      muted: "30 15% 92%",
      mutedForeground: "25 15% 45%",
      accent: "35 40% 55%",
      accentForeground: "30 20% 96%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      border: "30 20% 88%",
      input: "30 20% 88%",
      ring: "30 25% 35%",
      warmCream: "35 30% 95%",
      warmBeige: "30 25% 88%",
      warmBrown: "25 30% 45%",
      darkWood: "25 35% 22%",
      goldAccent: "40 50% 60%",
      sageGreen: "90 15% 45%"
    },
    typography: {
      fontSans: "'Inter', system-ui, sans-serif",
      fontSerif: "'Playfair Display', Georgia, serif",
      fontHeading: "'Playfair Display', Georgia, serif"
    },
    componentStyles: {
      borderRadius: "0.75rem",
      buttonRadius: "0.5rem",
      cardRadius: "1rem",
      shadowSm: "0 2px 4px -1px hsl(25 30% 45% / 0.1)",
      shadowMd: "0 4px 20px -4px hsl(25 30% 45% / 0.15)",
      shadowLg: "0 10px 40px -10px hsl(25 30% 45% / 0.2)"
    },
    layoutSettings: {
      containerMaxWidth: "1280px",
      sectionSpacing: "4rem",
      cardPadding: "1.5rem"
    }
  }
];
