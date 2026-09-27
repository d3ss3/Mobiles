// app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import ProductDrawer from '@/components/products/ProductDrawer';

export default function HomePage() {
  const { products } = useProducts();
  const { addToCart } = useCart();

  // حالات السلايدر الجانبي
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // عرض أحدث 4 منتجات في الصفحة الرئيسية
  const featuredProducts = products ? products.slice(0, 4) : [];

  return (
    <div className="space-y-12 pb-12" dir="rtl">
      {/* قسم الهيرو / Hero Section */}
      <section className="relative w-full bg-[url('https://chatgpt.com/backend-api/estuary/content?id=file_000000006180821192636d83afef85ff&ts=497361&p=fs&cid=1&sig=7e8d422502124adcef4a8d6a2d2f09a9bd37f2278b2d2d5f3bfdd0817ededa5c&v=0')] bg-cover bg-center py-24 px-6 overflow-hidden text-white shadow-xl">
  <div className="backdrop-blur-[2px]" />
  <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
    <h1 className="text-3xl sm:text-5xl font-black leading-tight">
      أحدث المنتجات والتقنيات بين يديك
    </h1>
    <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto">
      تسوق أفضل المنتجات الرقمية والإلكترونيات بأسعار تنافسية وجودة مضمونة.
    </p>
    <div className="pt-2">
      <Link
        href="/products"
        className="inline-block bg-white text-blue-600 font-extrabold px-8 py-3.5 rounded-2xl shadow-lg hover:bg-blue-50 transition-all active:scale-95"
      >
        استكشف كل المنتجات
      </Link>
    </div>
  </div>
</section>

      {/* قسم المنتجات المميزة */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              المنتجات المضافة حديثاً
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              تصفح أحدث ما تم إضافته للمتجر
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            عرض الكل ←
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed">
            <p className="text-slate-400">لا توجد منتجات متوفرة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* النقر على محتوى الكرت يفتح السلايدر */}
                <div
                  onClick={() => {
                    setSelectedProduct({
                      id: product.id,
                      name: product.title,
                      price: product.price,
                      image: product.image || 'https://via.placeholder.com/300',
                      description: product.description,
                      category: product.category,
                    });
                    setIsDrawerOpen(true);
                  }}
                  className="p-4 cursor-pointer"
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
                      e.stopPropagation(); // منع فتح السلايدر عند الضغط على زر السلة السريع
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
      </section>

      {/* استدعاء السلايدر الجانبي في الصفحة الرئيسية */}
      <ProductDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
