import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  Menu,
  X,
  LogOut,
  Bell,
  Palette,
  FolderTree,
  Users,
  Shield,
  FileText,
  Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Buyurtmalar', url: '/admin/orders', icon: ShoppingCart },
  { title: 'Toifalar', url: '/admin/categories', icon: FolderTree },
  { title: 'Mahsulotlar', url: '/admin/products', icon: Package },
  { title: 'Mijozlar', url: '/admin/customers', icon: Users },
  { title: 'Sayt kontenti', url: '/admin/content', icon: FileText },
  { title: 'Mavzular', url: '/admin/themes', icon: Palette },
  { title: 'Adminlar', url: '/admin/admins', icon: Shield },
  { title: 'Telegram', url: '/admin/settings', icon: Settings },
  { title: 'Tizim sozlamalari', url: '/admin/system', icon: Settings2 },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile header - fixed */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b flex items-center justify-between px-4 lg:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link to="/admin" className="font-serif text-lg font-bold text-primary">
          Admin Panel
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Mobile sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link to="/admin" className="font-serif text-xl font-bold text-primary">
            Admin Panel
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.url}
              to={item.url}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive(item.url)
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3"
            onClick={() => navigate('/')}
          >
            <LogOut className="h-4 w-4" />
            Saytga qaytish
          </Button>
        </div>
      </aside>

      {/* Desktop layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Desktop sidebar - fixed to viewport */}
        <aside className="w-64 bg-white border-r fixed inset-y-0 left-0 flex flex-col">
          <div className="flex items-center h-16 px-6 border-b">
            <Link to="/admin" className="font-serif text-xl font-bold text-primary">
              Admin Panel
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.url}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive(item.url)
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t mt-auto">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              onClick={() => navigate('/')}
            >
              <LogOut className="h-4 w-4" />
              Saytga qaytish
            </Button>
          </div>
        </aside>

        {/* Spacer for fixed sidebar */}
        <div className="w-64 flex-shrink-0" />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Desktop top header */}
          <header className="sticky top-0 z-20 h-16 bg-white border-b flex items-center justify-end px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                A
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile content */}
      <main className="p-4 lg:hidden">
        <Outlet />
      </main>
    </div>
  );
}
