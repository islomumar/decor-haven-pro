import { useEffect, useState } from 'react';
import { Save, Globe, Phone, MapPin, Settings2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface SystemSettings {
  id: string;
  site_name: string;
  logo_url: string | null;
  contact_phone: string | null;
  whatsapp_number: string | null;
  working_hours_uz: string | null;
  working_hours_ru: string | null;
  address_uz: string | null;
  address_ru: string | null;
  seo_title: string | null;
  seo_description: string | null;
  default_language: string;
  languages_enabled: string[];
}

const defaultSettings: Omit<SystemSettings, 'id'> = {
  site_name: 'Mebel Store',
  logo_url: null,
  contact_phone: '',
  whatsapp_number: '',
  working_hours_uz: '',
  working_hours_ru: '',
  address_uz: '',
  address_ru: '',
  seo_title: '',
  seo_description: '',
  default_language: 'uz',
  languages_enabled: ['uz', 'ru'],
};

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [formData, setFormData] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings(data);
        setFormData({
          site_name: data.site_name || '',
          logo_url: data.logo_url,
          contact_phone: data.contact_phone || '',
          whatsapp_number: data.whatsapp_number || '',
          working_hours_uz: data.working_hours_uz || '',
          working_hours_ru: data.working_hours_ru || '',
          address_uz: data.address_uz || '',
          address_ru: data.address_ru || '',
          seo_title: data.seo_title || '',
          seo_description: data.seo_description || '',
          default_language: data.default_language || 'uz',
          languages_enabled: data.languages_enabled || ['uz', 'ru'],
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({ variant: 'destructive', title: 'Xatolik', description: 'Sozlamalarni yuklashda xatolik' });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      if (settings) {
        const { error } = await supabase
          .from('system_settings')
          .update(formData)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('system_settings')
          .insert([formData]);

        if (error) throw error;
      }

      toast({ title: 'Muvaffaqiyat', description: 'Sozlamalar saqlandi' });
      fetchSettings();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const toggleLanguage = (lang: string) => {
    const enabled = formData.languages_enabled.includes(lang);
    if (enabled && formData.languages_enabled.length === 1) {
      toast({ variant: 'destructive', title: 'Xatolik', description: 'Kamida bitta til faol bo\'lishi kerak' });
      return;
    }

    setFormData({
      ...formData,
      languages_enabled: enabled
        ? formData.languages_enabled.filter((l) => l !== lang)
        : [...formData.languages_enabled, lang],
    });
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
          <h1 className="text-2xl font-bold">Tizim sozlamalari</h1>
          <p className="text-muted-foreground">Saytning asosiy sozlamalari</p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          Saqlash
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">
            <Settings2 className="h-4 w-4 mr-2" />
            Umumiy
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Phone className="h-4 w-4 mr-2" />
            Aloqa
          </TabsTrigger>
          <TabsTrigger value="language">
            <Globe className="h-4 w-4 mr-2" />
            Tillar
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Search className="h-4 w-4 mr-2" />
            SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Umumiy sozlamalar</CardTitle>
              <CardDescription>Saytning asosiy ma'lumotlari</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sayt nomi</Label>
                <Input
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                  placeholder="Mebel Store"
                />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={formData.logo_url || ''}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aloqa ma'lumotlari</CardTitle>
              <CardDescription>Telefon, manzil va ish vaqti</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefon raqam</Label>
                  <Input
                    value={formData.contact_phone || ''}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+998 90 123 45 67"
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp raqam</Label>
                  <Input
                    value={formData.whatsapp_number || ''}
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    placeholder="+998901234567"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ish vaqti (UZ)</Label>
                  <Input
                    value={formData.working_hours_uz || ''}
                    onChange={(e) => setFormData({ ...formData, working_hours_uz: e.target.value })}
                    placeholder="Du-Ju: 9:00 - 18:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ish vaqti (RU)</Label>
                  <Input
                    value={formData.working_hours_ru || ''}
                    onChange={(e) => setFormData({ ...formData, working_hours_ru: e.target.value })}
                    placeholder="Пн-Пт: 9:00 - 18:00"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Manzil (UZ)</Label>
                  <Textarea
                    value={formData.address_uz || ''}
                    onChange={(e) => setFormData({ ...formData, address_uz: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Manzil (RU)</Label>
                  <Textarea
                    value={formData.address_ru || ''}
                    onChange={(e) => setFormData({ ...formData, address_ru: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Til sozlamalari</CardTitle>
              <CardDescription>Saytda faol tillarni boshqaring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Asosiy til</Label>
                <Select
                  value={formData.default_language}
                  onValueChange={(value) => setFormData({ ...formData, default_language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uz">O'zbekcha</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Faol tillar</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>O'zbekcha (UZ)</span>
                    <Switch
                      checked={formData.languages_enabled.includes('uz')}
                      onCheckedChange={() => toggleLanguage('uz')}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>Русский (RU)</span>
                    <Switch
                      checked={formData.languages_enabled.includes('ru')}
                      onCheckedChange={() => toggleLanguage('ru')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO sozlamalari</CardTitle>
              <CardDescription>Qidiruv tizimlari uchun optimallashtirish</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>SEO sarlavha</Label>
                <Input
                  value={formData.seo_title || ''}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder="Mebel Store - Eng yaxshi mebellar"
                />
                <p className="text-xs text-muted-foreground">60 belgidan kam bo'lsin</p>
              </div>
              <div className="space-y-2">
                <Label>SEO tavsif</Label>
                <Textarea
                  value={formData.seo_description || ''}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">160 belgidan kam bo'lsin</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
