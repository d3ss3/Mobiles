// app/(shop)/cart/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <main
        className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-store-light text-store-dark"
        dir="rtl"
      >
        <div className="w-full max-w-xl bg-white rounded-3xl border border-zinc-200/85 shadow-xl shadow-zinc-200/40 p-10 text-center">
          <div className="w-16 h-16 bg-store-primary/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 text-store-primary border border-store-primary/20">
            🛒
          </div>
          <h2 className="text-2xl font-black text-store-dark mb-2">
            سلة التسوق فارغة
          </h2>
          <p className="text-sm font-medium text-zinc-500 mb-8">
            لم تقم بإضافة أي منتجات للسلة بعد. استعرض تشكيلتنا المتميزة وابدأ التسوق الآن.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-store-primary hover:bg-store-secondary text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-store-primary/25 transition-all active:scale-[0.98] text-sm"
          >
            تصفح المنتجات
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-[calc(100vh-5rem)] bg-store-light text-store-dark p-4 sm:p-6 lg:p-8"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="bg-store-primary/10 text-store-primary text-xs font-extrabold px-3 py-1 rounded-full border border-store-primary/20">
              سلة المشتريات 🛍️
            </span>
            <h1 className="text-3xl font-black text-store-dark tracking-tight mt-2">
              سلة التسوق
            </h1>
          </div>
          <span className="text-xs font-bold text-zinc-500 bg-white px-4 py-2 rounded-xl border border-zinc-200/80 shadow-sm">
            عدد المنتجات: <strong className="text-store-primary">{cart.length}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* قائمة المنتجات */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-xl border border-zinc-100 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-store-dark text-base line-clamp-1">
                      {item.product.title}
                    </h3>
                    <p className="text-xs font-bold text-zinc-500 mt-1">
                      {item.product.price} ر.س × {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-bold text-zinc-400 block">المجموع الفرعي</span>
                    <span className="font-black text-store-primary text-sm">
                      {item.product.price * item.quantity} ر.س
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                    title="حذف المنتج"
                  >
                    <span>🗑️</span>
                    <span className="hidden sm:inline">حذف</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ملخص الطلب الجانبي */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 sticky top-24">
            <h2 className="text-lg font-black text-store-dark mb-4 pb-3 border-b border-zinc-100">
              ملخص الطلب
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-600">
                <span>مجموع المنتجات:</span>
                <span>{totalPrice} ر.س</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-zinc-600">
                <span>رسوم الشحن:</span>
                <span className="text-emerald-600 font-extrabold">مجاني للشهر الحالي</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-zinc-100 pt-4 mb-6">
              <span className="font-extrabold text-store-dark text-sm">المجموع الكلي:</span>
              <span className="text-2xl font-black text-store-primary">
                {totalPrice} ر.س
              </span>
            </div>

            <Link
              href="/checkout"
              className="block w-full text-center bg-store-primary hover:bg-store-secondary text-white font-bold py-4 rounded-2xl shadow-lg shadow-store-primary/25 transition-all active:scale-[0.98] text-sm"
            >
              متابعة الشراء وإتمام الطلب
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}