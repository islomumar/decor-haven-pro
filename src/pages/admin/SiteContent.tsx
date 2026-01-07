import { ExternalLink, Eye, Pencil, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SiteContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sayt kontenti</h1>
        <p className="text-muted-foreground">Saytdagi barcha matnlarni vizual tahrirlang</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Yangi vizual tahrirlash tizimi</AlertTitle>
        <AlertDescription>
          Endi sayt kontentini to'g'ridan-to'g'ri sayt sahifalarida tahrirlashingiz mumkin. 
          Saytga o'ting va "Tahrirlash" tugmasini bosing.
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
                <CardDescription>Kontentni to'g'ridan-to'g'ri saytda tahrirlang</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Saytga o'ting va admin sifatida tizimga kirganingizda pastki o'ng burchakda 
              "Tahrirlash" tugmasi paydo bo'ladi. Uni bosib, istalgan matnni bevosita tahrirlang.
            </p>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Qanday ishlaydi:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Saytga o'ting
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  "Tahrirlash" tugmasini bosing
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Tahrir qilinadigan elementlar ajratiladi
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  ✏️ ikonasini bosib matnni o'zgartiring
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  UZ/RU tilini tanlang va alohida tahrirlang
                </li>
              </ul>
            </div>
            <Button asChild className="w-full">
              <Link to="/" target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Saytga o'tish
              </Link>
            </Button>
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
              <h4 className="font-medium mb-1">Saytga o'ting</h4>
              <p className="text-sm text-muted-foreground">
                Admin sifatida tizimga kirgan holda bosh sahifaga o'ting
              </p>
            </div>
            <div className="text-center p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h4 className="font-medium mb-1">Tahrirlash rejimini yoqing</h4>
              <p className="text-sm text-muted-foreground">
                Pastki o'ng burchakdagi "Tahrirlash" tugmasini bosing
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
