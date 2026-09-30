'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import ProductDrawer from '@/components/products/ProductDrawer';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const { products, categories, loading } = useProducts();
  const { addToCart } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 1. العثور على التصنيف المطابق من قائمة التصنيفات
  const currentCategory = categories.find(
    (cat) => 
      String(cat.id) === String(categoryParam) || 
      String(cat.slug).toLowerCase() === String(categoryParam).toLowerCase() ||
      String(cat.name).toLowerCase() === String(categoryParam).toLowerCase()
  );

  const categoryTitle = currentCategory ? currentCategory.name : categoryParam || '';

  // 2. فلترة المنتجات بدقة مطابقة تامة (حسب المعرف، الـ slug، أو اسم الفئة النصي)
  const filteredProducts = categoryParam
    ? products.filter((p: any) => {
        const pCategory = String(p.category || '').toLowerCase();
        const pCatId = String(p.category_id || '');
        const targetParam = String(categoryParam).toLowerCase();
        const catName = currentCategory ? String(currentCategory.name).toLowerCase() : '';
        const catSlug = currentCategory ? String(currentCategory.slug).toLowerCase() : '';
        const catId = currentCategory ? String(currentCategory.id) : '';

        return (
          pCategory === targetParam ||
          pCatId === targetParam ||
          (catName && pCategory === catName) ||
          (catSlug && pCategory === catSlug) ||
          (catId && pCatId === catId)
        );
      })
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 text-store-dark" dir="rtl">
      {/* عنوان الصفحة */}
      <div className="mb-10 text-center space-y-2">
        <span className="bg-store-primary/10 text-store-primary text-xs font-extrabold px-3.5 py-1.5 rounded-full inline-block">
          {categoryTitle ? `قطع غيار أصلية ومطابقة` : `كافة قطع الغيار المتوفرة`}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-store-dark">
          {categoryTitle ? `قطع غيار سيارات: ${categoryTitle}` : 'جميع قطع الغيار الصينية'}
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm max-w-xl mx-auto">
          {categoryTitle 
            ? `استعرض قطع الغيار المخصصة لـ ${categoryTitle} مع ضمان المطابقة برقم الهيكل (VIN).`
            : 'تصفح أحدث قطع الغيار المستوردة مباشرة من مصانع الصين لكافة الماركات.'}
        </p>
      </div>

      {/* عرض المحتوى */}
      {loading ? (
        <div className="text-center py-20 text-zinc-400 font-medium">جاري تحميل المنتجات من قاعدة البيانات...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-zinc-200 shadow-sm max-w-xl mx-auto space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="font-bold text-store-dark text-base">لا توجد منتجات متاحة لهذه الشركة حالياً</h3>
          <p className="text-zinc-400 text-xs px-4">
            {categoryTitle 
              ? `عذراً، لا توجد قطع غيار مسجلة حالياً لـ (${categoryTitle}). يمكنك إضافة منتجات جديدة لهذه الشركة من لوحة التحكم.`
              : 'لا توجد منتجات مضافة في المتجر حالياً.'}
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
                    image: product.image || 'https://via.placeholder.com/300',
                    description: product.description,
                    category: product.category,
                  });
                  setIsDrawerOpen(true);
                }}
                className="p-4 cursor-pointer"
              >
                <div className="relative h-48 rounded-2xl overflow-hidden bg-zinc-100 mb-4">
                  <img
                    src={product.image || 'https://via.placeholder.com/300'}
                    alt={product.title || product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.category && (
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-store-dark text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {product.category}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-store-dark text-base mb-1 line-clamp-1 group-hover:text-store-primary transition-colors">
                  {product.title || product.name}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2 mb-4">
                  {product.description}
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
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
                      image: product.image || 'https://via.placeholder.com/300',
                      description: product.description,
                    });
                  }}
                  className="bg-store-primary hover:bg-[#a0636a] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-1"
                >
                  + السلة
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* نافذة تفاصيل المنتج */}
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