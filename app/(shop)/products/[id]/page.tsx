// app/shop/products/[id]/page.tsx
'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  // فك التغليف لـ params في Next.js 15+
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const { products } = useProducts();
  const { addToCart } = useCart();

  // البحث عن المنتج المطلوب بناءً على الـ ID
  const product = products.find((p) => String(p.id) === String(productId));

  if (!product) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-store-light text-store-dark" dir="rtl">
        <div className="w-16 h-16 bg-store-primary/10 text-store-primary rounded-2xl flex items-center justify-center mb-4 border border-store-primary/20 text-2xl">
          🔍
        </div>
        <h2 className="text-2xl font-black text-store-dark mb-2">
          المنتج غير موجود!
        </h2>
        <p className="text-zinc-500 mb-6 font-medium">
          عذراً، لم نتمكن من العثور على المنتج المطلوب.
        </p>
        <Link
          href="/shop/products"
          className="inline-flex items-center justify-center bg-store-primary hover:bg-store-secondary text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-store-primary/25 transition-all text-sm active:scale-[0.98]"
        >
          العودة لقائمة المنتجات
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-store-light text-store-dark py-12 px-4 sm:px-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* رابط العودة */}
        <Link
          href="/shop/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-store-primary mb-8 transition-colors"
        >
          ← العودة لجميع المنتجات
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40">
          {/* صورة المنتج */}
          <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
            <img
              src={product.image || 'https://via.placeholder.com/600'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* معلومات المنتج */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {product.category && (
                <span className="inline-block bg-store-primary/10 text-store-primary text-xs font-bold px-3 py-1.5 rounded-full border border-store-primary/20">
                  {product.category}
                </span>
              )}
              <h1 className="text-2xl sm:text-4xl font-black text-store-dark tracking-tight">
                {product.title}
              </h1>
              <p className="text-2xl font-black text-store-primary">
                {product.price} ر.س
              </p>
              <hr className="border-zinc-100" />
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-medium">
                {product.description || 'لا يوجد وصف إضافي لهذا المنتج حالياً.'}
              </p>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="w-full bg-store-primary hover:bg-store-secondary text-white font-bold py-4 rounded-2xl shadow-lg shadow-store-primary/25 transition-all active:scale-[0.98] text-center text-sm cursor-pointer"
            >
              إضافة إلى السلة 🛒
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}