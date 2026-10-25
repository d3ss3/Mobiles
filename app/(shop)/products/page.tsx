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
  
    if (vinParam) {
      if (brand || model || year) {
        if (!fittedProductIds.includes(product.id)) {
          return false;
        }
      }
    }
  
    if (brand || model || year) {
      if (!fittedProductIds.includes(product.id)) {
        return false;
      }
    }
  
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
    <div className="min-h-screen bg-gradient-to-br from-store-dark via-zinc-900 to-store-primary py-10 px-4 sm:px-6 lg:px-8 text-store-dark" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* تنبيه إذا كان البحث نشطاً برقم OEM */}
        {oemParam && (
          <div className="p-4 bg-store-primary/10 border border-store-primary/20 rounded-2xl text-store-dark flex items-center justify-between shadow-sm">
            <span>نتائج البحث برقم القطعة (OEM): <strong className="text-store-primary">{oemParam}</strong></span>
            <a href="/products" className="text-xs font-bold text-store-secondary underline hover:opacity-80">إزالة البحث</a>
          </div>
        )}

        {/* رأس الصفحة وعنوانها المصغر مع فلترة متسلسلة ومرنة */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-200/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="bg-store-primary/10 text-store-primary text-[11px] font-extrabold px-3 py-1 rounded-full inline-block border border-store-primary/20">
                {categoryTitle || brand || oemParam ? `قطع غيار أصلية ومطابقة` : `كافة قطع الغيار المتوفرة`}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-store-dark">
                {oemParam ? `نتيجة البحث: ${oemParam}` : categoryTitle || brand ? `قطع غيار: ${categoryTitle || brand}` : 'جميع قطع الغيار الصينية'}
              </h1>
            </div>

            {/* عداد النتائج وزر إلغاء الفلترة */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="text-xs font-bold text-zinc-400 bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-100">
                النتائج: <span className="text-store-primary font-black">{filteredProducts.length}</span> قطـعة
              </div>
              {(categoryParam || brand || oemParam) && (
                <a
                  href="/products"
                  className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-all border border-red-100"
                >
                  إلغاء ✕
                </a>
              )}
            </div>
          </div>

          {/* شريط الفلترة والأقسام (متعدد الأسطر لضمان ظهور جميع الشركات والأسقام بوضوح) */}
          <div className="border-t border-zinc-100 pt-3 space-y-2" dir="rtl">
            <span className="text-xs font-bold text-zinc-400 block">تصفية حسب الأقسام والماركات:</span>
            
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <a
                href="/products"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  !categoryParam && !brand && !oemParam
                    ? 'bg-store-primary text-white shadow-sm'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                🔥 الكل
              </a>
              {categories.map((cat: any) => {
                const isSelected = String(categoryParam) === String(cat.id) || String(categoryParam) === String(cat.slug);
                return (
                  <a
                    key={cat.id}
                    href={`/products?category=${cat.slug || cat.id}`}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-store-primary text-white shadow-sm'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {cat.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* محتوى المنتجات والبطاقات */}
        {isLoading ? (
          <div className="text-center py-20 text-zinc-400 font-medium">جاري تحميل المنتجات المطابقة...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-zinc-300 shadow-sm max-w-xl mx-auto space-y-3 p-6">
            <div className="text-4xl">🔍</div>
            <h3 className="font-bold text-store-dark text-base">لا توجد منتجات مطابقة لخياراتك حالياً</h3>
            <p className="text-zinc-400 text-xs px-4">
              عذراً، لا توجد قطع مسجلة تطابق بيانات البحث. تأكد من صحة رقم القطعة أو الهيكل المدخل.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product: any) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* جزء تفاصيل المنتج والضغط للفتح */}
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
                  className="p-3.5 sm:p-4 cursor-pointer flex flex-col flex-1"
                >
                  {/* صورة القطعة */}
                  <div className="relative h-44 sm:h-48 rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 mb-3.5">
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1486006920555-c77dce18193c?auto=format&fit=crop&w=800&q=80'}
                      alt={product.title || product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.category && (
                      <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {product.category}
                      </span>
                    )}
                  </div>

                  {/* النصوص والعنوان */}
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-bold text-store-dark text-sm sm:text-base line-clamp-1 group-hover:text-store-primary transition-colors">
                      {product.title || product.name}
                    </h3>
                    
                    {product.oem_number && (
                      <div className="text-[11px] text-zinc-500 font-mono bg-zinc-50 px-2 py-0.5 rounded-md inline-block border border-zinc-100">
                        OEM: {product.oem_number}
                      </div>
                    )}
                    
                    <p className="text-xs text-zinc-400 line-clamp-2 pt-1">
                      {product.description || 'قطعة أصلية معتمدة لسياراتك الصينية بمواصفات مطابقة للمصنع الأصلي.'}
                    </p>
                  </div>
                </div>

                {/* شريط السعر وزر السلة */}
                <div className="p-3.5 sm:p-4 bg-zinc-50/80 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 font-medium">السعر شامل الضريبة</span>
                    <span className="text-sm sm:text-base font-black text-store-dark">
                      {product.price} <span className="text-xs font-normal">ر.س</span>
                    </span>
                  </div>

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
                    className="bg-store-primary hover:bg-store-secondary text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-1"
                  >
                    + السلة
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* نافذة تفاصيل المنتج الجانبية */}
        <ProductDrawer
          product={selectedProduct}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>
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