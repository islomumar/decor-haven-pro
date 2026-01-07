import { useState } from 'react';
import { ExternalLink, Eye, Pencil, Info, Play, Maximize2, Minimize2, RefreshCw, ArrowLeft, Smartphone, Monitor, Tablet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

type ViewMode = 'cards' | 'editor';
type DeviceSize = 'desktop' | 'tablet' | 'mobile';

export default function SiteContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop');
  const [currentPath, setCurrentPath] = useState('/');
  const [iframeKey, setIframeKey] = useState(0);

  const handleOpenVisualEditor = () => {
    setViewMode('editor');
  };

  const handleOpenInNewTab = () => {
    window.open('/?edit=true', '_blank');
  };

  const refreshIframe = () => {
    setIframeKey(prev => prev + 1);
  };

  const getIframeSrc = () => {
    return `${currentPath}${currentPath.includes('?') ? '&' : '?'}edit=true`;
  };

  const getDeviceWidth = () => {
    switch (deviceSize) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      default: return 'w-full';
    }
  };

  const pages = [
    { path: '/', label: 'Bosh sahifa' },
    { path: '/catalog', label: 'Katalog' },
    { path: '/about', label: 'Biz haqimizda' },
    { path: '/contact', label: 'Aloqa' },
    { path: '/faq', label: 'FAQ' },
  ];

  // Editor view with iframe
  if (viewMode === 'editor') {
    return (
      <div className={cn(
        "flex flex-col",
        isFullscreen ? "fixed inset-0 z-50 bg-background" : "h-[calc(100vh-8rem)]"
      )}>
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 p-3 border-b bg-card">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode('cards')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Orqaga
            </Button>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm font-medium text-muted-foreground">Vizual tahrirlash</span>
          </div>

          {/* Page Selector */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {pages.map(page => (
              <button
                key={page.path}
                onClick={() => setCurrentPath(page.path)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  currentPath === page.path
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {page.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Device Size Toggle */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setDeviceSize('mobile')}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  deviceSize === 'mobile' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
                title="Mobil"
              >
                <Smartphone className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeviceSize('tablet')}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  deviceSize === 'tablet' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
                title="Planshet"
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeviceSize('desktop')}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  deviceSize === 'desktop' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
                title="Desktop"
              >
                <Monitor className="h-4 w-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-border" />

            <Button variant="ghost" size="icon" onClick={refreshIframe} title="Yangilash">
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Kichiklashtirish" : "To'liq ekran"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={handleOpenInNewTab} title="Yangi oynada ochish">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Iframe Container */}
        <div className="flex-1 bg-muted/50 overflow-hidden flex justify-center p-4">
          <div className={cn(
            "h-full bg-background rounded-lg shadow-2xl overflow-hidden transition-all duration-300",
            getDeviceWidth()
          )}>
            <iframe
              key={iframeKey}
              src={getIframeSrc()}
              className="w-full h-full border-0"
              title="Site Preview"
            />
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t bg-card text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Tahrirlash rejimi yoqilgan
          </div>
          <span>{currentPath}</span>
        </div>
      </div>
    );
  }

  // Cards view (default)
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sayt kontenti</h1>
          <p className="text-muted-foreground">Saytdagi barcha matnlarni vizual tahrirlang</p>
        </div>
        <Button onClick={handleOpenVisualEditor} size="lg" className="gap-2">
          <Play className="h-5 w-5" />
          Vizual tahrirlashni boshlash
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Yangi vizual tahrirlash tizimi</AlertTitle>
        <AlertDescription>
          Endi sayt kontentini to'g'ridan-to'g'ri shu yerda tahrirlashingiz mumkin. 
          "Vizual tahrirlashni boshlash" tugmasini bosing.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Visual Editor Card */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Pencil className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Vizual tahrirlash</CardTitle>
                <CardDescription>Kontentni to'g'ridan-to'g'ri shu yerda tahrirlang</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Shu sahifadan chiqmasdan sayt kontentini tahrirlashingiz mumkin. 
              Barcha o'zgarishlar avtomatik saqlanadi.
            </p>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Xususiyatlar:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Desktop, planshet va mobil ko'rinishlar
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Barcha sahifalar o'rtasida almashish
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  To'liq ekran rejimi
                </li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleOpenVisualEditor} className="flex-1">
                <Pencil className="mr-2 h-4 w-4" />
                Tahrirlashni boshlash
              </Button>
              <Button variant="outline" onClick={handleOpenInNewTab}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Eye className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle>Ko'rish rejimi</CardTitle>
                <CardDescription>Saytni mehmonlar ko'rinishida ko'ring</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              "Ko'rish rejimi"ga o'tib, sayt mehmonlar uchun qanday ko'rinishda ekanligini 
              tekshiring. Bu rejimda tahrirlash imkoniyati yo'q.
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Tahrirlanadigan seksiyalar:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-background rounded text-xs">Hero sarlavha</span>
                <span className="px-2 py-1 bg-background rounded text-xs">Hero tavsif</span>
                <span className="px-2 py-1 bg-background rounded text-xs">Aksiya</span>
                <span className="px-2 py-1 bg-background rounded text-xs">Toifalar</span>
                <span className="px-2 py-1 bg-background rounded text-xs">Footer</span>
              </div>
            </div>
            <Button variant="outline" asChild className="w-full">
              <Link to="/">
                <Eye className="mr-2 h-4 w-4" />
                Saytni ko'rish
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vizual tahrirlash qo'llanmasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h4 className="font-medium mb-1">Tahrirlashni boshlang</h4>
              <p className="text-sm text-muted-foreground">
                "Vizual tahrirlashni boshlash" tugmasini bosing
              </p>
            </div>
            <div className="text-center p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h4 className="font-medium mb-1">Sahifani tanlang</h4>
              <p className="text-sm text-muted-foreground">
                Yuqoridagi menyudan kerakli sahifani tanlang
              </p>
            </div>
            <div className="text-center p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h4 className="font-medium mb-1">Matnlarni o'zgartiring</h4>
              <p className="text-sm text-muted-foreground">
                ✏️ ikonasini bosib matnni tahrirlang va saqlang
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}