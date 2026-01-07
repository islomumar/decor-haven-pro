import { useEffect, useState } from 'react';
import { Phone, User, FileText, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  phone: string;
  name: string | null;
  notes: string | null;
  created_at: string;
  order_count?: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_price: number | null;
  created_at: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // Get customers with order counts
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (customersError) throw customersError;

      // Get order counts per customer
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('customer_id');

      if (ordersError) throw ordersError;

      // Count orders per customer
      const orderCounts: Record<string, number> = {};
      ordersData?.forEach((order) => {
        if (order.customer_id) {
          orderCounts[order.customer_id] = (orderCounts[order.customer_id] || 0) + 1;
        }
      });

      const customersWithCounts = (customersData || []).map((customer) => ({
        ...customer,
        order_count: orderCounts[customer.id] || 0,
      }));

      setCustomers(customersWithCounts);
    } catch (error) {
      console.error('Error:', error);
      toast({ variant: 'destructive', title: 'Xatolik', description: 'Mijozlarni yuklashda xatolik' });
    } finally {
      setLoading(false);
    }
  };

  const openCustomerDialog = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setNotes(customer.notes || '');
    setDialogOpen(true);

    // Fetch customer orders
    const { data, error } = await supabase
      .from('orders')
      .select('id, order_number, status, total_price, created_at')
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setCustomerOrders(data || []);
    }
  };

  const saveNotes = async () => {
    if (!selectedCustomer) return;

    try {
      const { error } = await supabase
        .from('customers')
        .update({ notes })
        .eq('id', selectedCustomer.id);

      if (error) throw error;
      
      toast({ title: 'Muvaffaqiyat', description: 'Izoh saqlandi' });
      fetchCustomers();
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

  const formatPrice = (price: number | null) => {
    if (!price) return '—';
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mijozlar</h1>
        <p className="text-muted-foreground">Barcha mijozlar va ularning buyurtmalari</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Barcha mijozlar ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ism</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Buyurtmalar soni</TableHead>
                <TableHead>Izohlar</TableHead>
                <TableHead>Ro'yxatdan o'tgan</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{customer.name || 'Noma\'lum'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {customer.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      {customer.order_count || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {customer.notes ? (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span className="truncate max-w-[150px]">{customer.notes}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(customer.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openCustomerDialog(customer)}>
                      Batafsil
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Mijozlar topilmadi
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mijoz ma'lumotlari</DialogTitle>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Ism</Label>
                  <p className="font-medium">{selectedCustomer.name || 'Noma\'lum'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefon</Label>
                  <p className="font-medium">{selectedCustomer.phone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Izohlar</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mijoz haqida izoh qo'shing..."
                  rows={3}
                />
                <Button size="sm" onClick={saveNotes}>Izohni saqlash</Button>
              </div>

              <div className="space-y-2">
                <Label>Buyurtmalar tarixi</Label>
                {customerOrders.length > 0 ? (
                  <div className="space-y-2">
                    {customerOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <p className="text-sm font-medium mt-1">{formatPrice(order.total_price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Buyurtmalar yo'q</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Yopish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
