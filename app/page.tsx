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
    <div className="space-y-16 pb-16 text-store-dark" dir="rtl">
      {/* 1. قسم الهيرو / Hero Section */}
      <section className="relative w-full bg-[url('/images/background.jpg')] bg-cover bg-center py-28 px-6 overflow-hidden text-white shadow-xl">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            أحدث المنتجات والتقنيات بين يديك
          </h1>
          <p className="text-zinc-200 text-sm sm:text-base max-w-2xl mx-auto">
            تسوق أفضل المنتجات الرقمية والإلكترونيات بأسعار تنافسية وجودة مضمونة.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-block bg-white text-store-primary font-extrabold px-8 py-3.5 rounded-2xl shadow-lg hover:bg-store-light transition-all active:scale-95"
            >
              استكشف كل المنتجات
            </Link>
          </div>
        </div>
      </section>

      {/* 2. قسم التصنيفات السريعة (يعطي حيوية للمتجر) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-store-dark">تصفح حسب القسم</h2>
          <p className="text-xs text-zinc-500 mt-1">اختر التصنيف المناسب لاحتياجك</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['إلكترونيات', 'إكسسوارات', 'أجهزة ذكية', 'عروض مميزة'].map((cat, idx) => (
            <Link
              key={idx}
              href="/products"
              className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm hover:border-store-primary hover:shadow-md transition-all text-center group"
            >
              <div className="w-12 h-12 bg-store-light rounded-2xl mx-auto flex items-center justify-center text-store-primary font-black mb-3 group-hover:scale-110 transition-transform">
                {idx + 1}
              </div>
              <h3 className="font-bold text-store-dark text-sm group-hover:text-store-primary transition-colors">
                {cat}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. قسم المنتجات المضافة حديثاً */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-store-dark">
              المنتجات المضافة حديثاً
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              تصفح أحدث ما تم إضافته للمتجر
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-bold text-store-primary hover:text-store-secondary flex items-center gap-1"
          >
            عرض الكل ←
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-zinc-200">
            <p className="text-zinc-400">لا توجد منتجات متوفرة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
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
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-zinc-100 mb-4">
                    <img
                      src={product.image || 'https://via.placeholder.com/300'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.category && (
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-store-dark text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {product.category}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-store-dark text-base mb-1 line-clamp-1 group-hover:text-store-primary transition-colors">
                    {product.title}
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
    e.stopPropagation(); // منع فتح السلايدر عند الضغط على زر السلة السريع
    addToCart(product);
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
      </section>

      {/* 4. قسم مميزات المتجر (Trust Badges / Features) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-store-light rounded-2xl mx-auto flex items-center justify-center text-store-primary text-xl font-bold">
              🚚
            </div>
            <h3 className="font-bold text-store-dark">شحن سريع وآمن</h3>
            <p className="text-xs text-zinc-500">توصيل لجميع مناطق المملكة بأسرع وقت</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-store-light rounded-2xl mx-auto flex items-center justify-center text-store-primary text-xl font-bold">
              🔒
            </div>
            <h3 className="font-bold text-store-dark">دفع إلكتروني آمن</h3>
            <p className="text-xs text-zinc-500">طرق دفع متعددة ومحمية بالكامل</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-store-light rounded-2xl mx-auto flex items-center justify-center text-store-primary text-xl font-bold">
              ⭐
            </div>
            <h3 className="font-bold text-store-dark">ضمان الجودة</h3>
            <p className="text-xs text-zinc-500">منتجات أصلية ومضمونة 100%</p>
          </div>
        </div>
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