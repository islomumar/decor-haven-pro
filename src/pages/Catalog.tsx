import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProductCard } from '@/components/ProductCard';
import { products, categories, materials } from '@/lib/data';
import { useLanguage } from '@/hooks/useLanguage';

export default function Catalog() {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const name = language === 'uz' ? product.name_uz : product.name_ru;
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
      const matchesMaterial = selectedMaterial === 'all' || product.materials.some(m => m.toLowerCase().includes(selectedMaterial.toLowerCase()));
      
      let matchesPrice = true;
      if (priceRange === 'under5') matchesPrice = product.price < 5000000;
      else if (priceRange === '5to10') matchesPrice = product.price >= 5000000 && product.price < 10000000;
      else if (priceRange === 'over10') matchesPrice = product.price >= 10000000;

      return matchesSearch && matchesCategory && matchesMaterial && matchesPrice && product.active;
    });
  }, [search, selectedCategory, selectedMaterial, priceRange, language]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setPriceRange('all');
    setSearchParams({});
  };

  const hasActiveFilters = search || selectedCategory !== 'all' || selectedMaterial !== 'all' || priceRange !== 'all';

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <label className="text-sm font-medium mb-2 block">{t.catalog.category}</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
        <Select value={priceRange} onValueChange={setPriceRange}>
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
        <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
          <SelectTrigger>
            <SelectValue placeholder={t.catalog.allMaterials} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.catalog.allMaterials}</SelectItem>
            {materials.map(mat => (
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
    <div className="min-h-screen py-8">
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
              {t.catalog.showing} {paginatedProducts.length} {t.catalog.of} {filteredProducts.length} {t.catalog.products}
            </p>

            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">{t.catalog.noProducts}</p>
                <Button variant="link" onClick={clearFilters}>{t.catalog.clearFilters}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
