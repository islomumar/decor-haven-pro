import { useEffect, useState } from 'react';
import { Plus, Shield, ShieldCheck, Trash2, UserCog, ShoppingCart, Package } from 'lucide-react';
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
import { AccessDenied } from '@/components/admin/AccessDenied';
import { AppRole, roleDisplayInfo } from '@/lib/permissions';

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole | 'editor'; // 'editor' for backward compatibility
  created_at: string;
}

export default function Admins() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState<AppRole>('seller');
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
      
      // Map the data with proper typing
      const mappedRoles: UserRole[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        role: item.role as AppRole | 'editor',
        created_at: item.created_at
      }));
      
      setUserRoles(mappedRoles);
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
      setRole('seller');
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

  const handleUpdateRole = async (userRoleId: string, newRole: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('id', userRoleId);

      if (error) throw error;

      toast({ title: 'Muvaffaqiyat', description: 'Rol yangilandi' });
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

  const getRoleInfo = (role: string) => {
    // Map 'editor' to 'manager' for display
    const mappedRole = role === 'editor' ? 'manager' : role;
    return roleDisplayInfo[mappedRole as AppRole] || roleDisplayInfo.seller;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="h-3 w-3 mr-1" />;
      case 'manager':
      case 'editor':
        return <Package className="h-3 w-3 mr-1" />;
      case 'seller':
        return <ShoppingCart className="h-3 w-3 mr-1" />;
      default:
        return <UserCog className="h-3 w-3 mr-1" />;
    }
  };

  if (!isAdmin) {
    return <AccessDenied />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const adminCount = userRoles.filter(r => r.role === 'admin').length;
  const managerCount = userRoles.filter(r => r.role === 'manager' || r.role === 'editor').length;
  const sellerCount = userRoles.filter(r => r.role === 'seller').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Foydalanuvchilar</h1>
          <p className="text-muted-foreground">Foydalanuvchi rollarini boshqaring</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Rol berish
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Adminlar</CardTitle>
            <ShieldCheck className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
            <p className="text-xs text-muted-foreground">To'liq ruxsat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Menejerlar</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managerCount}</div>
            <p className="text-xs text-muted-foreground">Mahsulotlar va kontent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sotuvchilar</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellerCount}</div>
            <p className="text-xs text-muted-foreground">Buyurtmalar</p>
          </CardContent>
        </Card>
      </div>

      {/* Role Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Rollar haqida</CardTitle>
          <CardDescription>Har bir rol uchun ruxsatlar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">Sotuvchi</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Buyurtmalarni ko'rish va boshqarish</li>
                <li>✓ Mijozlarni ko'rish</li>
                <li>✗ Mahsulotlar va toifalar</li>
                <li>✗ Sayt kontenti</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-green-500" />
                <span className="font-semibold">Menejer</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Toifalar va mahsulotlarni boshqarish</li>
                <li>✓ Sayt kontentini tahrirlash</li>
                <li>✓ Telegram sozlamalari</li>
                <li>✗ Buyurtmalar va mijozlar</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-red-500" />
                <span className="font-semibold">Admin</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Barcha bo'limlarga to'liq kirish</li>
                <li>✓ Foydalanuvchilarni boshqarish</li>
                <li>✓ Tizim sozlamalari</li>
                <li>✓ Rollarni berish va o'zgartirish</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Foydalanuvchi rollari</CardTitle>
          <CardDescription>
            Tizimga kirgan va rol berilgan barcha foydalanuvchilar
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
              {userRoles.map((userRole) => {
                const roleInfo = getRoleInfo(userRole.role);
                return (
                  <TableRow key={userRole.id}>
                    <TableCell className="font-mono text-sm">
                      {userRole.user_id}
                      {userRole.user_id === user?.id && (
                        <Badge variant="outline" className="ml-2">Siz</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={userRole.role === 'editor' ? 'manager' : userRole.role}
                        onValueChange={(v) => handleUpdateRole(userRole.id, v as AppRole)}
                        disabled={userRole.user_id === user?.id}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue>
                            <Badge className={roleInfo.color}>
                              {getRoleIcon(userRole.role)}
                              {roleInfo.label}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="seller">
                            <div className="flex items-center gap-2">
                              <ShoppingCart className="h-4 w-4 text-blue-500" />
                              Sotuvchi
                            </div>
                          </SelectItem>
                          <SelectItem value="manager">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-green-500" />
                              Menejer
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4 text-red-500" />
                              Admin
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                );
              })}
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

      {/* Current User Info */}
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
              <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seller">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-blue-500" />
                      Sotuvchi - Buyurtmalar va mijozlar
                    </div>
                  </SelectItem>
                  <SelectItem value="manager">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-green-500" />
                      Menejer - Mahsulotlar va kontent
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-red-500" />
                      Admin - To'liq ruxsat
                    </div>
                  </SelectItem>
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
              Bu foydalanuvchi admin paneliga kira olmaydi.
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
