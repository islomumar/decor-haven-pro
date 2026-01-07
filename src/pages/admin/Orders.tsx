import { useEffect, useState } from 'react';
import { Eye, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  product_name_snapshot: string;
  selected_options: {
    size?: string;
    color?: string;
    material?: string;
  } | null;
  quantity: number;
  price_snapshot: number | null;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_message: string | null;
  status: string;
  total_price: number | null;
  created_at: string;
  order_items?: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Xatolik',
        description: 'Buyurtmalarni yuklashda xatolik yuz berdi',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw error;

      const order = orders.find(o => o.id === orderId);
      if (order) {
        setSelectedOrder({
          ...order,
          order_items: orderItems as OrderItem[],
        });
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }

      toast({
        title: 'Muvaffaqiyat',
        description: 'Buyurtma holati yangilandi',
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Xatolik',
        description: 'Holatni yangilashda xatolik',
        variant: 'destructive',
      });
    }
  };

  const deleteOrder = async () => {
    if (!deleteOrderId) return;

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', deleteOrderId);

      if (error) throw error;

      setOrders(prev => prev.filter(order => order.id !== deleteOrderId));
      setDeleteOrderId(null);

      toast({
        title: 'Muvaffaqiyat',
        description: 'Buyurtma o\'chirildi',
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: 'Xatolik',
        description: 'Buyurtmani o\'chirishda xatolik',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      new: { variant: 'default', label: 'Yangi' },
      in_progress: { variant: 'secondary', label: 'Jarayonda' },
      completed: { variant: 'outline', label: 'Bajarildi' },
      cancelled: { variant: 'destructive', label: 'Bekor qilindi' },
    };
    const config = variants[status] || variants.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number | null) => {
    if (!price) return '-';
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Buyurtmalar</h1>
          <p className="text-muted-foreground">Barcha buyurtmalarni boshqaring</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Holat bo'yicha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barchasi</SelectItem>
              <SelectItem value="new">Yangi</SelectItem>
              <SelectItem value="in_progress">Jarayonda</SelectItem>
              <SelectItem value="completed">Bajarildi</SelectItem>
              <SelectItem value="cancelled">Bekor qilindi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Buyurtmalar topilmadi</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Buyurtma №</TableHead>
                    <TableHead>Mijoz</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Holat</TableHead>
                    <TableHead>Sana</TableHead>
                    <TableHead className="text-right">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.customer_phone}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => fetchOrderDetails(order.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteOrderId(order.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buyurtma tafsilotlari</DialogTitle>
            <DialogDescription>
              {selectedOrder?.order_number}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mijoz</label>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Telefon</label>
                  <p className="font-medium">{selectedOrder.customer_phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sana</label>
                  <p>{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Holat</label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Yangi</SelectItem>
                      <SelectItem value="in_progress">Jarayonda</SelectItem>
                      <SelectItem value="completed">Bajarildi</SelectItem>
                      <SelectItem value="cancelled">Bekor qilindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedOrder.customer_message && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Xabar</label>
                  <p className="mt-1 p-3 bg-muted rounded-lg">{selectedOrder.customer_message}</p>
                </div>
              )}

              {/* Order Items */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Buyurtma mahsulotlari</label>
                <div className="mt-2 space-y-3">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between">
                        <p className="font-medium">{item.product_name_snapshot}</p>
                        <p className="text-sm">x{item.quantity}</p>
                      </div>
                      {item.selected_options && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          {item.selected_options.size && <span>O'lcham: {item.selected_options.size} | </span>}
                          {item.selected_options.color && <span>Rang: {item.selected_options.color} | </span>}
                          {item.selected_options.material && <span>Material: {item.selected_options.material}</span>}
                        </div>
                      )}
                      {item.price_snapshot && (
                        <p className="mt-1 text-sm font-medium">{formatPrice(item.price_snapshot)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.total_price && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Jami:</span>
                    <span className="text-xl font-bold">{formatPrice(selectedOrder.total_price)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteOrderId} onOpenChange={() => setDeleteOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Buyurtmani o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham bu buyurtmani o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={deleteOrder} className="bg-destructive text-destructive-foreground">
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
