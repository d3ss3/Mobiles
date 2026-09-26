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
    <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8" dir="rtl">
      <div>
        <h1 className="text-3xl font-black text-slate-900">جميع المنتجات</h1>
        <p className="text-sm text-slate-500 mt-1">
          تصفح كافة منتجات المتجر المتاحة
        </p>
      </div>

      {/* شريط البحث والتصفية */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all flex-1"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-600"
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
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
          <p className="text-slate-400 font-medium">
            لا توجد منتجات متوفرة حالياً.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
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
                <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-100 mb-4">
                  <img
                    src={product.image || 'https://via.placeholder.com/300'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.category && (
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                  {product.description}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-base font-black text-slate-900">
                  {product.price} ر.س
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // منع فتح السلايدر عند الضغط مباشرة على زر السلة السريع
                    addToCart(product);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
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
