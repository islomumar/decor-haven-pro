import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/hooks/useLanguage";
import { CartProvider } from "@/hooks/useCart";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeLoader } from "@/components/ThemeLoader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminAuth from "./pages/admin/Auth";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Categories from "./pages/admin/Categories";
import ProductsNew from "./pages/admin/ProductsNew";
import Customers from "./pages/admin/Customers";
import SiteContent from "./pages/admin/SiteContent";
import Admins from "./pages/admin/Admins";
import Settings from "./pages/admin/Settings";
import SystemSettings from "./pages/admin/SystemSettings";
import Themes from "./pages/admin/Themes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ThemeLoader>
        <LanguageProvider>
          <CartProvider>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Admin Auth */}
                    <Route path="/admin/auth" element={<AdminAuth />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="categories" element={<Categories />} />
                      <Route path="products" element={<ProductsNew />} />
                      <Route path="customers" element={<Customers />} />
                      <Route path="content" element={<SiteContent />} />
                      <Route path="admins" element={<Admins />} />
                      <Route path="themes" element={<Themes />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="system" element={<SystemSettings />} />
                    </Route>
                  
                  {/* Public Routes */}
                  <Route path="*" element={
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/catalog" element={<Catalog />} />
                          <Route path="/product/:id" element={<ProductDetails />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/faq" element={<FAQ />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                      <WhatsAppButton />
                    </div>
                    } />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </AuthProvider>
          </CartProvider>
        </LanguageProvider>
      </ThemeLoader>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
