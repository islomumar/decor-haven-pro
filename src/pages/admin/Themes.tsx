import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Theme } from '@/lib/themes';
import { Check, Eye, EyeOff, Palette, Moon, Sun, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const Themes = () => {
  const { 
    themes, 
    currentTheme, 
    isLoading, 
    setActiveTheme, 
    previewTheme, 
    resetPreview, 
    isPreviewMode,
    refreshThemes 
  } = useTheme();
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'light' | 'dark'>('all');
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const filteredThemes = themes.filter(theme => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'light') return !theme.isDark;
    if (selectedCategory === 'dark') return theme.isDark;
    return true;
  });

  const handlePreview = (theme: Theme) => {
    if (previewingId === theme.id) {
      resetPreview();
      setPreviewingId(null);
    } else {
      previewTheme(theme);
      setPreviewingId(theme.id || null);
    }
  };

  const handleApply = async (theme: Theme) => {
    if (!theme.id) return;
    
    await setActiveTheme(theme.id);
    setPreviewingId(null);
    toast.success(`"${theme.name}" mavzusi qo'llanildi!`);
  };

  const getColorSwatches = (theme: Theme) => {
    const colors = [
      theme.colorPalette.primary,
      theme.colorPalette.secondary,
      theme.colorPalette.accent,
      theme.colorPalette.background,
      theme.colorPalette.foreground
    ];
    return colors;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif">Mavzular</h1>
          <p className="text-muted-foreground mt-1">
            Sayt dizaynini bir marta bosish bilan o'zgartiring
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isPreviewMode && (
            <Button variant="outline" onClick={() => { resetPreview(); setPreviewingId(null); }}>
              <EyeOff className="h-4 w-4 mr-2" />
              Ko'rishni bekor qilish
            </Button>
          )}
          <Button variant="outline" onClick={refreshThemes}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Yangilash
          </Button>
        </div>
      </div>

      {/* Current Theme Display */}
      {currentTheme && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <Palette className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">Joriy mavzu</CardTitle>
                  <CardDescription>{currentTheme.name}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentTheme.isDark ? (
                  <Badge variant="secondary"><Moon className="h-3 w-3 mr-1" /> Qorong'i</Badge>
                ) : (
                  <Badge variant="secondary"><Sun className="h-3 w-3 mr-1" /> Yorug'</Badge>
                )}
                <Badge variant="default"><Check className="h-3 w-3 mr-1" /> Faol</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {getColorSwatches(currentTheme).map((color, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-md border shadow-sm"
                  style={{ backgroundColor: `hsl(${color})` }}
                  title={color}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Theme Categories */}
      <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
        <TabsList>
          <TabsTrigger value="all">
            Barcha ({themes.length})
          </TabsTrigger>
          <TabsTrigger value="light">
            <Sun className="h-4 w-4 mr-1" />
            Yorug' ({themes.filter(t => !t.isDark).length})
          </TabsTrigger>
          <TabsTrigger value="dark">
            <Moon className="h-4 w-4 mr-1" />
            Qorong'i ({themes.filter(t => t.isDark).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredThemes.map((theme) => (
              <ThemeCard
                key={theme.id || theme.slug}
                theme={theme}
                isActive={currentTheme?.id === theme.id}
                isPreviewing={previewingId === theme.id}
                onPreview={() => handlePreview(theme)}
                onApply={() => handleApply(theme)}
                colorSwatches={getColorSwatches(theme)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredThemes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Bu kategoriyada mavzu topilmadi
        </div>
      )}
    </div>
  );
};

interface ThemeCardProps {
  theme: Theme;
  isActive: boolean;
  isPreviewing: boolean;
  onPreview: () => void;
  onApply: () => void;
  colorSwatches: string[];
}

const ThemeCard = ({ theme, isActive, isPreviewing, onPreview, onApply, colorSwatches }: ThemeCardProps) => {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${
      isActive ? 'ring-2 ring-primary' : ''
    } ${isPreviewing ? 'ring-2 ring-accent' : ''}`}>
      {/* Theme Preview Mini */}
      <div 
        className="h-32 relative"
        style={{ 
          backgroundColor: `hsl(${theme.colorPalette.background})`,
        }}
      >
        {/* Mini layout preview */}
        <div className="absolute inset-2 flex flex-col gap-2">
          {/* Header bar */}
          <div 
            className="h-6 rounded"
            style={{ backgroundColor: `hsl(${theme.colorPalette.primary})` }}
          />
          {/* Content area */}
          <div className="flex-1 flex gap-2">
            <div 
              className="w-1/3 rounded"
              style={{ backgroundColor: `hsl(${theme.colorPalette.card})` }}
            />
            <div 
              className="w-2/3 rounded"
              style={{ backgroundColor: `hsl(${theme.colorPalette.secondary})` }}
            />
          </div>
          {/* Footer accent */}
          <div 
            className="h-4 rounded"
            style={{ backgroundColor: `hsl(${theme.colorPalette.accent})` }}
          />
        </div>

        {/* Status badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          {isActive && (
            <Badge className="bg-green-500 text-white text-xs">
              <Check className="h-3 w-3" />
            </Badge>
          )}
          {theme.isDark && (
            <Badge variant="secondary" className="text-xs">
              <Moon className="h-3 w-3" />
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">{theme.name}</h3>
        </div>

        {/* Color Swatches */}
        <div className="flex gap-1 mb-4">
          {colorSwatches.map((color, i) => (
            <div
              key={i}
              className="h-5 w-5 rounded-full border shadow-sm"
              style={{ backgroundColor: `hsl(${color})` }}
            />
          ))}
        </div>

        {/* Typography & Styles Info */}
        <div className="text-xs text-muted-foreground mb-4 space-y-1">
          <p>Font: {theme.typography.fontSans.split(',')[0].replace(/'/g, '')}</p>
          <p>Border radius: {theme.componentStyles.borderRadius}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onPreview}
          >
            {isPreviewing ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Yopish
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Ko'rish
              </>
            )}
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={onApply}
            disabled={isActive}
          >
            {isActive ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Faol
              </>
            ) : (
              'Qo\'llash'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Themes;
