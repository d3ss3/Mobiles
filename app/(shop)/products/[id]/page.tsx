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
      <main className="max-w-4xl mx-auto px-4 py-16 text-center" dir="rtl">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          المنتج غير موجود!
        </h2>
        <p className="text-slate-500 mb-6">
          عذراً، لم نتمكن من العثور على المنتج المطلوب.
        </p>
        <Link
          href="/shop/products"
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          العودة لقائمة المنتجات
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-8 py-12" dir="rtl">
      {/* رابط العودة */}
      <Link
        href="/shop/products"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-8 transition-colors"
      >
        ← العودة لجميع المنتجات
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
        {/* صورة المنتج */}
        <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100">
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
              <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                {product.category}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
              {product.title}
            </h1>
            <p className="text-2xl font-black text-blue-600">
              {product.price} ر.س
            </p>
            <hr className="border-slate-100" />
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {product.description || 'لا يوجد وصف إضافي لهذا المنتج حالياً.'}
            </p>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/25 transition-all active:scale-95 text-center"
          >
            إضافة إلى السلة 🛒
          </button>
        </div>
      </div>
    </main>
  );
}
