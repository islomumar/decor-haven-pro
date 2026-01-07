import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

interface Category {
  id: string;
  name_uz: string;
  name_ru: string;
}

interface Product {
  id: string;
  name_uz: string;
  name_ru: string;
  description_uz: string | null;
  description_ru: string | null;
  full_description_uz: string | null;
  full_description_ru: string | null;
  category_id: string | null;
  price: number | null;
  original_price: number | null;
  images: string[];
  materials: string[];
  sizes: string[];
  colors: string[];
  is_negotiable: boolean;
  in_stock: boolean;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

const emptyForm = {
  name_uz: '',
  name_ru: '',
  description_uz: '',
  description_ru: '',
  full_description_uz: '',
  full_description_ru: '',
  category_id: '',
  price: '',
  original_price: '',
  images: [] as string[],
  materials: '',
  sizes: '',
  colors: '',
  is_negotiable: false,
  in_stock: true,
  is_featured: false,
  is_active: true,
};

export default function ProductsNew() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [newImageUrl, setNewImageUrl] = useState('');
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('id, name_uz, name_ru').order('sort_order'),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({ variant: 'destructive', title: 'Xatolik', description: 'Ma\'lumotlarni yuklashda xatolik' });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return '—';
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '—';
    const category = categories.find(c => c.id === categoryId);
    return category ? (language === 'uz' ? category.name_uz : category.name_ru) : '—';
  };

  const openCreateDialog = () => {
    setSelectedProduct(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name_uz: product.name_uz,
      name_ru: product.name_ru,
      description_uz: product.description_uz || '',
      description_ru: product.description_ru || '',
      full_description_uz: product.full_description_uz || '',
      full_description_ru: product.full_description_ru || '',
      category_id: product.category_id || '',
      price: product.price?.toString() || '',
      original_price: product.original_price?.toString() || '',
      images: product.images || [],
      materials: (product.materials || []).join(', '),
      sizes: (product.sizes || []).join(', '),
      colors: (product.colors || []).join(', '),
      is_negotiable: product.is_negotiable,
      in_stock: product.in_stock,
      is_featured: product.is_featured,
      is_active: product.is_active,
    });
    setDialogOpen(true);
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl.trim()] });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const handleSubmit = async () => {
    if (!formData.name_uz || !formData.name_ru) {
      toast({ variant: 'destructive', title: 'Xatolik', description: 'Mahsulot nomini kiriting' });
      return;
    }

    const productData = {
      name_uz: formData.name_uz,
      name_ru: formData.name_ru,
      description_uz: formData.description_uz || null,
      description_ru: formData.description_ru || null,
      full_description_uz: formData.full_description_uz || null,
      full_description_ru: formData.full_description_ru || null,
      category_id: formData.category_id || null,
      price: formData.price ? parseFloat(formData.price) : null,
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      images: formData.images,
      materials: formData.materials.split(',').map(s => s.trim()).filter(Boolean),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean),
      is_negotiable: formData.is_negotiable,
      in_stock: formData.in_stock,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
    };

    try {
      if (selectedProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', selectedProduct.id);
        if (error) throw error;
        toast({ title: 'Muvaffaqiyat', description: 'Mahsulot yangilandi' });
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        toast({ title: 'Muvaffaqiyat', description: 'Mahsulot yaratildi' });
      }

      setDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: error.message });
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', selectedProduct.id);
      if (error) throw error;
      toast({ title: 'Muvaffaqiyat', description: 'Mahsulot o\'chirildi' });
      setDeleteDialogOpen(false);
      fetchData();
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
          <h1 className="text-2xl font-bold">Mahsulotlar</h1>
          <p className="text-muted-foreground">Barcha mahsulotlarni boshqaring</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Yangi mahsulot
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Barcha mahsulotlar ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rasm</TableHead>
                <TableHead>Nomi</TableHead>
                <TableHead>Toifa</TableHead>
                <TableHead>Narxi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name_uz} className="h-12 w-12 object-cover rounded" />
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{language === 'uz' ? product.name_uz : product.name_ru}</p>
                      {product.is_featured && <Badge variant="secondary" className="mt-1">Tanlangan</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryName(product.category_id)}</TableCell>
                  <TableCell>
                    {product.is_negotiable ? (
                      <Badge variant="outline">Kelishiladi</Badge>
                    ) : (
                      formatPrice(product.price)
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Badge variant={product.is_active ? 'default' : 'secondary'}>
                        {product.is_active ? 'Faol' : 'Nofaol'}
                      </Badge>
                      {product.in_stock ? (
                        <Badge variant="outline" className="text-green-600">Mavjud</Badge>
                      ) : (
                        <Badge variant="destructive">Tugagan</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => { setSelectedProduct(product); setPreviewDialogOpen(true); }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => { setSelectedProduct(product); setDeleteDialogOpen(true); }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Mahsulotlar topilmadi
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Asosiy</TabsTrigger>
              <TabsTrigger value="description">Tavsif</TabsTrigger>
              <TabsTrigger value="images">Rasmlar</TabsTrigger>
              <TabsTrigger value="attributes">Xususiyatlar</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nomi (UZ) *</Label>
                  <Input
                    value={formData.name_uz}
                    onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })}
                    placeholder="O'zbek tilida"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nomi (RU) *</Label>
                  <Input
                    value={formData.name_ru}
                    onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                    placeholder="На русском"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Toifa</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toifani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {language === 'uz' ? cat.name_uz : cat.name_ru}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Narxi</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Eski narxi</Label>
                  <Input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_negotiable}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_negotiable: checked })}
                  />
                  <Label>Kelishiladi</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.in_stock}
                    onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked })}
                  />
                  <Label>Mavjud</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label>Tanlangan</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Faol</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="description" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Qisqa tavsif (UZ)</Label>
                  <Textarea
                    value={formData.description_uz}
                    onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Qisqa tavsif (RU)</Label>
                  <Textarea
                    value={formData.description_ru}
                    onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>To'liq tavsif (UZ)</Label>
                  <Textarea
                    value={formData.full_description_uz}
                    onChange={(e) => setFormData({ ...formData, full_description_uz: e.target.value })}
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label>To'liq tavsif (RU)</Label>
                  <Textarea
                    value={formData.full_description_ru}
                    onChange={(e) => setFormData({ ...formData, full_description_ru: e.target.value })}
                    rows={5}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4 mt-4">
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Rasm URL manzilini kiriting"
                />
                <Button type="button" onClick={addImage}>Qo'shish</Button>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt="" className="w-full h-24 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="attributes" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Materiallar (vergul bilan ajrating)</Label>
                <Input
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  placeholder="Yog'och, MDF, Metall"
                />
              </div>
              <div className="space-y-2">
                <Label>O'lchamlar (vergul bilan ajrating)</Label>
                <Input
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="160x200, 180x200, 200x200"
                />
              </div>
              <div className="space-y-2">
                <Label>Ranglar (vergul bilan ajrating)</Label>
                <Input
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  placeholder="Oq, Qora, Jigarrang"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleSubmit}>{selectedProduct ? 'Saqlash' : 'Yaratish'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mahsulot ko'rinishi</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              {selectedProduct.images?.[0] && (
                <img 
                  src={selectedProduct.images[0]} 
                  alt={selectedProduct.name_uz} 
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="text-xl font-bold">{selectedProduct.name_uz}</h3>
                <p className="text-muted-foreground">{selectedProduct.name_ru}</p>
              </div>
              <div className="text-2xl font-bold text-primary">
                {selectedProduct.is_negotiable ? 'Kelishiladi' : formatPrice(selectedProduct.price)}
              </div>
              {selectedProduct.description_uz && (
                <p className="text-muted-foreground">{selectedProduct.description_uz}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mahsulotni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham "{selectedProduct?.name_uz}" mahsulotini o'chirmoqchimisiz?
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
