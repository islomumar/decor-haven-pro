import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

interface Category {
  id: string;
  name_uz: string;
  name_ru: string;
  slug: string;
  image: string | null;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name_uz: '',
    name_ru: '',
    slug: '',
    image: '',
    icon: 'Package',
    is_active: true,
  });
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({ variant: 'destructive', title: 'Xatolik', description: 'Toifalarni yuklashda xatolik' });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const openCreateDialog = () => {
    setSelectedCategory(null);
    setFormData({ name_uz: '', name_ru: '', slug: '', image: '', icon: 'Package', is_active: true });
    setDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name_uz: category.name_uz,
      name_ru: category.name_ru,
      slug: category.slug,
      image: category.image || '',
      icon: category.icon,
      is_active: category.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name_uz || !formData.name_ru) {
      toast({ variant: 'destructive', title: 'Xatolik', description: 'Barcha maydonlarni to\'ldiring' });
      return;
    }

    const slug = formData.slug || generateSlug(formData.name_uz);

    try {
      if (selectedCategory) {
        const { error } = await supabase
          .from('categories')
          .update({ ...formData, slug })
          .eq('id', selectedCategory.id);

        if (error) throw error;
        toast({ title: 'Muvaffaqiyat', description: 'Toifa yangilandi' });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([{ ...formData, slug, sort_order: categories.length }]);

        if (error) throw error;
        toast({ title: 'Muvaffaqiyat', description: 'Toifa yaratildi' });
      }

      setDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: error.message });
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', selectedCategory.id);

      if (error) throw error;
      toast({ title: 'Muvaffaqiyat', description: 'Toifa o\'chirildi' });
      setDeleteDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: error.message });
    }
  };

  const toggleStatus = async (category: Category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !category.is_active })
        .eq('id', category.id);

      if (error) throw error;
      fetchCategories();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: error.message });
    }
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
          <h1 className="text-2xl font-bold">Toifalar</h1>
          <p className="text-muted-foreground">Mahsulot toifalarini boshqaring</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Yangi toifa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Barcha toifalar ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Rasm</TableHead>
                <TableHead>Nomi (UZ)</TableHead>
                <TableHead>Nomi (RU)</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  </TableCell>
                  <TableCell>
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name_uz} 
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{category.name_uz}</TableCell>
                  <TableCell>{category.name_ru}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell>
                    <Badge variant={category.is_active ? 'default' : 'secondary'}>
                      {category.is_active ? 'Faol' : 'Nofaol'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Switch 
                        checked={category.is_active} 
                        onCheckedChange={() => toggleStatus(category)}
                      />
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => { setSelectedCategory(category); setDeleteDialogOpen(true); }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Toifalar topilmadi
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? 'Toifani tahrirlash' : 'Yangi toifa'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nomi (UZ)</Label>
                <Input
                  value={formData.name_uz}
                  onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })}
                  placeholder="O'zbek tilida"
                />
              </div>
              <div className="space-y-2">
                <Label>Nomi (RU)</Label>
                <Input
                  value={formData.name_ru}
                  onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                  placeholder="На русском"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="avtomatik yaratiladi"
              />
            </div>
            <div className="space-y-2">
              <Label>Rasm URL</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label>Faol</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleSubmit}>{selectedCategory ? 'Saqlash' : 'Yaratish'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Toifani o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham "{selectedCategory?.name_uz}" toifasini o'chirmoqchimisiz? 
              Bu amalni qaytarib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
