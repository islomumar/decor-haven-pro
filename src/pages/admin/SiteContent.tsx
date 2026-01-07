import { useEffect, useState } from 'react';
import { Save, FileText, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  id: string;
  key: string;
  value_uz: string | null;
  value_ru: string | null;
  content_type: string;
  page: string | null;
  section: string | null;
}

export default function SiteContent() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedContent, setEditedContent] = useState<Record<string, { value_uz: string; value_ru: string }>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('page', { ascending: true });

      if (error) throw error;
      
      setContent(data || []);
      
      // Initialize edited content
      const initial: Record<string, { value_uz: string; value_ru: string }> = {};
      data?.forEach((item) => {
        initial[item.key] = {
          value_uz: item.value_uz || '',
          value_ru: item.value_ru || '',
        };
      });
      setEditedContent(initial);
    } catch (error) {
      console.error('Error:', error);
      toast({ variant: 'destructive', title: 'Xatolik', description: 'Kontentni yuklashda xatolik' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, lang: 'value_uz' | 'value_ru', value: string) => {
    setEditedContent((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang]: value,
      },
    }));
  };

  const saveContent = async (key: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .update({
          value_uz: editedContent[key].value_uz,
          value_ru: editedContent[key].value_ru,
        })
        .eq('key', key);

      if (error) throw error;
      toast({ title: 'Muvaffaqiyat', description: 'Kontent saqlandi' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const saveAllContent = async () => {
    setSaving(true);
    try {
      for (const item of content) {
        await supabase
          .from('site_content')
          .update({
            value_uz: editedContent[item.key].value_uz,
            value_ru: editedContent[item.key].value_ru,
          })
          .eq('key', item.key);
      }
      toast({ title: 'Muvaffaqiyat', description: 'Barcha kontent saqlandi' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const groupedContent = content.reduce((acc, item) => {
    const page = item.page || 'other';
    if (!acc[page]) acc[page] = [];
    acc[page].push(item);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  const pageLabels: Record<string, string> = {
    homepage: 'Bosh sahifa',
    about: 'Biz haqimizda',
    contact: 'Aloqa',
    footer: 'Footer',
    other: 'Boshqa',
  };

  const keyLabels: Record<string, string> = {
    hero_title: 'Hero sarlavha',
    hero_subtitle: 'Hero tavsif',
    hero_cta: 'Hero tugma',
    promo_title: 'Aksiya sarlavha',
    promo_subtitle: 'Aksiya tavsif',
    about_story: 'Tarix sarlavha',
    about_story_text: 'Tarix matni',
    footer_description: 'Footer tavsif',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sayt kontenti</h1>
          <p className="text-muted-foreground">Saytdagi barcha matnlarni tahrirlang</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchContent}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Yangilash
          </Button>
          <Button onClick={saveAllContent} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            Hammasini saqlash
          </Button>
        </div>
      </div>

      <Tabs defaultValue="homepage">
        <TabsList>
          {Object.keys(groupedContent).map((page) => (
            <TabsTrigger key={page} value={page}>
              {pageLabels[page] || page}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedContent).map(([page, items]) => (
          <TabsContent key={page} value={page} className="space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-base">{keyLabels[item.key] || item.key}</CardTitle>
                    </div>
                    <Button size="sm" onClick={() => saveContent(item.key)} disabled={saving}>
                      <Save className="h-3 w-3 mr-1" />
                      Saqlash
                    </Button>
                  </div>
                  <CardDescription>Kalit: {item.key}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>O'zbekcha</Label>
                      {item.content_type === 'text' && (item.value_uz?.length || 0) < 100 ? (
                        <Input
                          value={editedContent[item.key]?.value_uz || ''}
                          onChange={(e) => handleChange(item.key, 'value_uz', e.target.value)}
                        />
                      ) : (
                        <Textarea
                          value={editedContent[item.key]?.value_uz || ''}
                          onChange={(e) => handleChange(item.key, 'value_uz', e.target.value)}
                          rows={3}
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Ruscha</Label>
                      {item.content_type === 'text' && (item.value_ru?.length || 0) < 100 ? (
                        <Input
                          value={editedContent[item.key]?.value_ru || ''}
                          onChange={(e) => handleChange(item.key, 'value_ru', e.target.value)}
                        />
                      ) : (
                        <Textarea
                          value={editedContent[item.key]?.value_ru || ''}
                          onChange={(e) => handleChange(item.key, 'value_ru', e.target.value)}
                          rows={3}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
