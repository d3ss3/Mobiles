'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import ProductDrawer from '@/components/products/ProductDrawer';
import { createClient } from '@supabase/supabase-js';

// إنشاء اتصال سوبابيس للاستعلامات المباشرة للربط
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

function ProductsContent() {
  const searchParams = useSearchParams();
  
  const oemParam = searchParams.get('oem');
  const vinParam = searchParams.get('vin');
  const categoryParam = searchParams.get('category');
  const brand = searchParams.get('brand');
  const model = searchParams.get('model');
  const year = searchParams.get('year');
  
  const { products, categories, loading: contextLoading } = useProducts();
  const { addToCart } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // حالات خاصة للبحث المربوط بالسيارات (عبر جدول fitments)
  const [fittedProductIds, setFittedProductIds] = useState<string[]>([]);
  const [loadingFitments, setLoadingFitments] = useState(false);

  // جلب المنتجات المطابقة للسيارة (الماركة، الموديل، السنة) من جدول product_fitments و vehicles
  useEffect(() => {
    async function fetchFitmentProducts() {
      if (!brand && !model && !year) {
        setFittedProductIds([]);
        return;
      }

      setLoadingFitments(true);
      try {
        let vehicleQuery = supabase.from('vehicles').select('id');
        
        if (brand) {
          const cleanBrand = brand.match(/\(([^)]+)\)/)?.[1]?.trim() || brand.split('(')[0].trim();
          vehicleQuery = vehicleQuery.ilike('brand', `%${cleanBrand}%`);
        }
        if (model) {
          vehicleQuery = vehicleQuery.ilike('model', model);
        }
        if (year) {
          vehicleQuery = vehicleQuery.eq('year', year);
        }

        const { data: vehicles, error: vError } = await vehicleQuery;
        if (vError) throw vError;

        if (!vehicles || vehicles.length === 0) {
          setFittedProductIds(['NO_MATCH']);
          return;
        }

        const vehicleIds = vehicles.map((v) => v.id);

        const { data: fitments, error: fError } = await supabase
          .from('product_fitments')
          .select('product_id')
          .in('vehicle_id', vehicleIds);

        if (fError) throw fError;

        if (fitments && fitments.length > 0) {
          setFittedProductIds(fitments.map((f) => f.product_id));
        } else {
          setFittedProductIds(['NO_MATCH']);
        }
      } catch (err) {
        console.error('Error fetching fitments:', err);
        setFittedProductIds(['NO_MATCH']);
      } finally {
        setLoadingFitments(false);
      }
    }

    fetchFitmentProducts();
  }, [brand, model, year]);

  const currentCategory = categories.find(
    (cat) => 
      String(cat.id) === String(categoryParam) || 
      String(cat.slug).toLowerCase() === String(categoryParam).toLowerCase() ||
      String(cat.name).toLowerCase() === String(categoryParam).toLowerCase()
  );

  const categoryTitle = currentCategory ? currentCategory.name : categoryParam || brand || '';

  // تصفية المنتجات بناءً على التصنيف أو محدد السيارة أو رقم OEM
  const filteredProducts = products.filter((product: any) => {
    // 1. التصفية برقم القطعة (OEM)
    if (oemParam) {
      const cleanQuery = oemParam.toLowerCase().trim();
      const productOEM = String(product.oem_number || '').toLowerCase().trim();
      const productTitle = String(product.title || product.name || '').toLowerCase().trim();
  
      const matchesOEM = productOEM.includes(cleanQuery);
      const matchesTitle = productTitle.includes(cleanQuery);
  
      if (!matchesOEM && !matchesTitle) {
        return false;
      }
    }
  
    // 2. التصفية برقم الهيكل (VIN)
    if (vinParam) {
      if (brand || model || year) {
        if (!fittedProductIds.includes(product.id)) {
          return false;
        }
      }
    }
  
    // 3. التصفية حسب محدد السيارات (الماركة / الموديل / السنة)
    if (brand || model || year) {
      if (!fittedProductIds.includes(product.id)) {
        return false;
      }
    }
  
    // 4. التصفية حسب القسم (Category)
    if (categoryParam) {
      const pCategory = String(product.category || '').toLowerCase();
      const pCatId = String(product.category_id || '');
      const targetParam = String(categoryParam).toLowerCase();
      const catName = currentCategory ? String(currentCategory.name).toLowerCase() : '';
      const catSlug = currentCategory ? String(currentCategory.slug).toLowerCase() : '';
      const catId = currentCategory ? String(currentCategory.id) : '';
  
      const matchesCategory = (
        pCategory === targetParam ||
        pCatId === targetParam ||
        (catName && pCategory === catName) ||
        (catSlug && pCategory === catSlug) ||
        (catId && pCatId === catId)
      );
  
      if (!matchesCategory) return false;
    }
  
    return true;
  });

  const isLoading = contextLoading || loadingFitments;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 text-store-dark" dir="rtl">
      {/* تنبيه إذا كان البحث نشطاً برقم OEM */}
      {oemParam && (
        <div className="mb-6 p-4 bg-store-primary/10 border border-store-primary/20 rounded-2xl text-store-dark flex items-center justify-between">
          <span>نتائج البحث برقم القطعة (OEM): <strong className="text-store-primary">{oemParam}</strong></span>
          <a href="/products" className="text-xs font-bold text-store-secondary underline">إزالة البحث</a>
        </div>
      )}

      <div className="mb-10 text-center space-y-2">
        <span className="bg-store-accent/20 text-store-accent text-xs font-extrabold px-3.5 py-1.5 rounded-full inline-block border border-store-accent/30">
          {categoryTitle || brand || oemParam ? `قطع غيار أصلية ومطابقة` : `كافة قطع الغيار المتوفرة`}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-store-dark">
          {oemParam ? `نتيجة البحث عن: ${oemParam}` : categoryTitle || brand ? `قطع غيار سيارات: ${categoryTitle || brand}` : 'جميع قطع الغيار الصينية'}
        </h1>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-zinc-400 font-medium">جاري تحميل المنتجات المطابقة...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-store-light rounded-3xl border border-dashed border-zinc-200 shadow-sm max-w-xl mx-auto space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="font-bold text-store-dark text-base">لا توجد منتجات مطابقة لخياراتك حالياً</h3>
          <p className="text-zinc-400 text-xs px-4">
            عذراً، لا توجد قطع مسجلة تطابق بيانات البحث. تأكد من صحة رقم القطعة أو الهيكل المدخل.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div
                onClick={() => {
                  setSelectedProduct({
                    id: product.id,
                    name: product.title || product.name,
                    price: product.price,
                    image: product.image || 'https://images.unsplash.com/photo-1486006920555-c77dce18193c?auto=format&fit=crop&w=800&q=80',
                    description: product.description,
                    category: product.category,
                    oem_number: product.oem_number,
                  });
                  setIsDrawerOpen(true);
                }}
                className="p-4 cursor-pointer"
              >
                <div className="relative h-48 rounded-2xl overflow-hidden bg-store-light mb-4">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1486006920555-c77dce18193c?auto=format&fit=crop&w=800&q=80'}
                    alt={product.title || product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.category && (
                    <span className="absolute top-3 right-3 bg-store-accent/90 backdrop-blur-md text-store-dark text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {product.category}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-store-dark text-base mb-1 line-clamp-1 group-hover:text-store-secondary transition-colors">
                  {product.title || product.name}
                </h3>
                {product.oem_number && (
                  <p className="text-xs text-zinc-400 font-mono mb-1">
                    OEM: {product.oem_number}
                  </p>
                )}
                <p className="text-xs text-zinc-500 line-clamp-2 mb-4">
                  {product.description}
                </p>
              </div>

              <div className="p-4 bg-store-light border-t border-zinc-100 flex items-center justify-between">
                <span className="text-base font-black text-store-dark">
                  {product.price} ر.س
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      id: product.id,
                      title: product.title || product.name,
                      price: product.price,
                      image: product.image || 'https://images.unsplash.com/photo-1486006920555-c77dce18193c?auto=format&fit=crop&w=800&q=80',
                      description: product.description,
                      category: product.category,
                      stock: product.stock || 10,
                    });
                  }}
                  className="bg-store-primary hover:bg-store-secondary text-white px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-1"
                >
                  + السلة
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-zinc-400 font-medium">جاري تحميل الصفحة...</div>}>
      <ProductsContent />
    </Suspense>
  );
}