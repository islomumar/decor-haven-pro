import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProductCard } from '@/components/ProductCard';
import { useProducts, useCategories, MATERIALS, ProductFilters } from '@/hooks/useProducts';
import { useLanguage } from '@/hooks/useLanguage';
import { useSEO } from '@/hooks/useSEO';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useAuth } from '@/hooks/useAuth';

const PAGE_SIZE = 24;

export default function Catalog() {
  const { language, t } = useLanguage();
  const { settings } = useSystemSettings();
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial values from URL
  const initialCategory = searchParams.get('category') || 'all';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Build filters
  const filters: ProductFilters = useMemo(() => {
    const f: ProductFilters = {
      isActive: true,
    };

    if (debouncedSearch) f.search = debouncedSearch;
    if (selectedCategory !== 'all') f.categoryId = selectedCategory;
    if (selectedMaterial !== 'all') f.material = selectedMaterial;

    if (priceRange === 'under5') {
      f.priceMax = 5000000;
    } else if (priceRange === '5to10') {
      f.priceMin = 5000000;
      f.priceMax = 10000000;
    } else if (priceRange === 'over10') {
      f.priceMin = 10000000;
    }

    return f;
  }, [debouncedSearch, selectedCategory, selectedMaterial, priceRange]);

  // Fetch products with server-side pagination
  const { products, totalCount, totalPages, loading } = useProducts(currentPage, filters, PAGE_SIZE);
  
  // Fetch categories
  const { categories } = useCategories();

  // SEO - canonical to page 1 for paginated pages
  useSEO({
    title: `${t.catalog.title} | ${settings?.site_name || 'Mebel Store'}`,
    description: t.catalog.title,
    canonical: currentPage > 1 ? '/catalog' : undefined,
  });

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (currentPage > 1) params.set('page', currentPage.toString());
    setSearchParams(params, { replace: true });
  }, [selectedCategory, currentPage, setSearchParams]);

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setPriceRange('all');
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = debouncedSearch || selectedCategory !== 'all' || selectedMaterial !== 'all' || priceRange !== 'all';

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push('ellipsis');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('ellipsis');

      pages.push(totalPages);
    }

    return pages;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <label className="text-sm font-medium mb-2 block">{t.catalog.category}</label>
        <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setCurrentPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder={t.catalog.allCategories} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.catalog.allCategories}</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>
                {language === 'uz' ? cat.name_uz : cat.name_ru}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-medium mb-2 block">{t.catalog.priceRange}</label>
        <Select value={priceRange} onValueChange={(v) => { setPriceRange(v); setCurrentPage(1); }}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha narxlar</SelectItem>
            <SelectItem value="under5">5 mln gacha</SelectItem>
            <SelectItem value="5to10">5 - 10 mln</SelectItem>
            <SelectItem value="over10">10 mln dan yuqori</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Material */}
      <div>
        <label className="text-sm font-medium mb-2 block">{t.catalog.material}</label>
        <Select value={selectedMaterial} onValueChange={(v) => { setSelectedMaterial(v); setCurrentPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder={t.catalog.allMaterials} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.catalog.allMaterials}</SelectItem>
            {MATERIALS.map(mat => (
              <SelectItem key={mat.id} value={mat.id}>
                {language === 'uz' ? mat.name_uz : mat.name_ru}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full gap-2">
          <X className="w-4 h-4" /> {t.catalog.clearFilters}
        </Button>
      )}
    </div>
  );

  return (
    <div id="hero" className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">{t.catalog.title}</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t.catalog.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> {t.catalog.filters}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>{t.catalog.filters}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card p-6 rounded-2xl shadow-warm">
              <h3 className="font-medium mb-4">{t.catalog.filters}</h3>
              <FilterContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-4">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Yuklanmoqda...
                </span>
              ) : (
                <>
                  {t.catalog.showing} {products.length} {t.catalog.of} {totalCount} {t.catalog.products}
                </>
              )}
            </p>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-warm animate-pulse">
                    <div className="aspect-[4/3] bg-muted" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {getPaginationNumbers().map((page, idx) => (
                      page === 'ellipsis' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">...</span>
                      ) : (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      )
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">{t.catalog.noProducts}</p>
                {isAdmin && selectedCategory !== 'all' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Debug: Category ID = {selectedCategory}
                  </p>
                )}
                <Button variant="link" onClick={clearFilters}>{t.catalog.clearFilters}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}