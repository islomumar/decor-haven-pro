import { useEffect, useState } from 'react';
import { Plus, Shield, ShieldCheck, Trash2, UserCog } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'editor';
  created_at: string;
  user_email?: string;
}

export default function Admins() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState<'admin' | 'editor'>('editor');
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchUserRoles();
    }
  }, [isAdmin]);

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({ variant: 'destructive', title: 'Xatolik', description: 'Rollarni yuklashda xatolik' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    if (!userId.trim()) {
      toast({ variant: 'destructive', title: 'Xatolik', description: 'User ID kiriting' });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId.trim(), role }]);

      if (error) {
        if (error.message.includes('duplicate')) {
          throw new Error('Bu foydalanuvchiga allaqachon rol berilgan');
        }
        throw error;
      }

      toast({ title: 'Muvaffaqiyat', description: 'Rol berildi' });
      setDialogOpen(false);
      setUserId('');
      setRole('editor');
      fetchUserRoles();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: error.message });
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', selectedRole.id);

      if (error) throw error;

      toast({ title: 'Muvaffaqiyat', description: 'Rol olib tashlandi' });
      setDeleteDialogOpen(false);
      fetchUserRoles();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: error.message });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Shield className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Ruxsat yo'q</h2>
        <p className="text-muted-foreground">Bu sahifani faqat adminlar ko'rishi mumkin</p>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold">Adminlar</h1>
          <p className="text-muted-foreground">Foydalanuvchi rollarini boshqaring</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Rol berish
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Adminlar</CardTitle>
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userRoles.filter(r => r.role === 'admin').length}
            </div>
            <p className="text-xs text-muted-foreground">To'liq ruxsatli</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Editorlar</CardTitle>
            <UserCog className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userRoles.filter(r => r.role === 'editor').length}
            </div>
            <p className="text-xs text-muted-foreground">Cheklangan ruxsat</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Foydalanuvchi rollari</CardTitle>
          <CardDescription>
            Admin - to'liq ruxsat (rollarni boshqarish, sozlamalar). Editor - kontent boshqarish.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Berilgan sana</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userRoles.map((userRole) => (
                <TableRow key={userRole.id}>
                  <TableCell className="font-mono text-sm">{userRole.user_id}</TableCell>
                  <TableCell>
                    <Badge variant={userRole.role === 'admin' ? 'default' : 'secondary'}>
                      {userRole.role === 'admin' ? (
                        <><ShieldCheck className="h-3 w-3 mr-1" /> Admin</>
                      ) : (
                        <><UserCog className="h-3 w-3 mr-1" /> Editor</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(userRole.created_at)}</TableCell>
                  <TableCell className="text-right">
                    {userRole.user_id !== user?.id && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => { setSelectedRole(userRole); setDeleteDialogOpen(true); }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {userRoles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Hali rollar berilmagan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Joriy foydalanuvchi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>User ID:</strong> <code className="bg-muted px-2 py-1 rounded text-sm">{user?.id}</code></p>
            <p className="text-sm text-muted-foreground">
              Bu ID ni boshqa foydalanuvchilarga berishingiz mumkin, ular ro'yxatdan o'tib, sizga ID ni yuborishadi.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add Role Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rol berish</DialogTitle>
            <DialogDescription>
              Foydalanuvchining User ID sini kiriting va rolni tanlang
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select value={role} onValueChange={(v) => setRole(v as 'admin' | 'editor')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin (to'liq ruxsat)</SelectItem>
                  <SelectItem value="editor">Editor (kontent boshqarish)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleAddRole}>Rol berish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rolni olib tashlash</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham bu foydalanuvchidan rolni olib tashlamoqchimisiz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole} className="bg-destructive text-destructive-foreground">
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
