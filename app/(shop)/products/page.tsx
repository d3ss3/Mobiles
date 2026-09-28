// app/shop/products/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import ProductDrawer from '@/components/products/ProductDrawer';

export default function ShopProductsPage() {
  const { products } = useProducts();
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // حالات السلايدر الجانبي لتفاصيل المنتج
  interface DrawerProduct {
    id: string | number;
    name: string;
    price: number;
    image: string;
    description?: string;
    category?: string;
  }
  
  const [selectedProduct, setSelectedProduct] =
    useState<DrawerProduct | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      const matchesSearch =
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-store-light text-store-dark max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8" dir="rtl">
      <div>
        <span className="bg-store-primary/10 text-store-primary text-xs font-extrabold px-3 py-1 rounded-full border border-store-primary/20">
          كتالوج المنتجات 🛍️
        </span>
        <h1 className="text-3xl font-black text-store-dark tracking-tight mt-2">جميع المنتجات</h1>
        <p className="text-sm font-medium text-zinc-500 mt-1">
          تصفحافة منتجات المتجر المتاحة واستكشف عروضنا المميزة
        </p>
      </div>

      {/* شريط البحث والتصفية */}
      <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl px-4 py-3 pl-10 text-sm font-medium text-store-dark outline-none focus:border-store-primary focus:bg-white focus:ring-4 focus:ring-store-primary/10 transition-all"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
            🔍
          </span>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-64 bg-zinc-50/50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm font-medium text-store-dark outline-none focus:border-store-primary focus:bg-white focus:ring-4 focus:ring-store-primary/10 transition-all cursor-pointer"
        >
          <option value="all">جميع التصنيفات</option>
          <option value="إلكترونيات">إلكترونيات</option>
          <option value="إكسسوارات">إكسسوارات</option>
          <option value="ملابس">ملابس</option>
          <option value="أدوات منزلية">أدوات منزلية</option>
        </select>
      </div>

      {/* شبكة المنتجات */}
      {!filteredProducts || filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-zinc-300 shadow-sm">
          <div className="w-16 h-16 bg-store-primary/10 text-store-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl border border-store-primary/20">
            📭
          </div>
          <h3 className="text-lg font-bold text-store-dark mb-1">لا توجد منتجات مطابقة</h3>
          <p className="text-sm font-medium text-zinc-400">
            لم نتمكن من العثور على منتجات متوفرة حالياً تطابق بحثك.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* الضغط على كرت المنتج يفتح السلايدر الجانبي */}
              <div
                onClick={() => {
                  setSelectedProduct({
                    id: product.id,
                    name: product.title, // مطابقة الاسم مع واجهة السلايدر
                    price: product.price,
                    image: product.image || 'https://via.placeholder.com/300',
                    description: product.description,
                    category: product.category,
                  });
                  setIsDrawerOpen(true);
                }}
                className="p-4 block cursor-pointer"
              >
                <div className="relative h-48 rounded-2xl overflow-hidden bg-zinc-100 mb-4 border border-zinc-100">
                  <img
                    src={product.image || 'https://via.placeholder.com/300'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.category && (
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-store-dark text-[11px] font-bold px-2.5 py-1 rounded-full border border-zinc-200/50 shadow-sm">
                      {product.category}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-store-dark text-base mb-1 line-clamp-1 group-hover:text-store-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2 mb-4 font-medium">
                  {product.description}
                </p>
              </div>

              <div className="p-4 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-base font-black text-store-dark">
                  {product.price} ر.س
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // منع فتح السلايدر عند الضغط مباشرة على زر السلة السريع
                    addToCart(product);
                  }}
                  className="bg-store-primary hover:bg-store-secondary text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-store-primary/20 active:scale-[0.98] cursor-pointer"
                >
                  + السلة
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* سلايدر تفاصيل المنتج الجانبي */}
      <ProductDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </main>
  );
}