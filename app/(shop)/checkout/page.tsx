// app/(shop)/checkout/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <main
        className="min-h-[70vh] flex flex-col items-center justify-center p-8"
        dir="rtl"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">السلة فارغة</h2>
        <p className="text-gray-500 mb-6">
          أضف بعض المنتجات إلى السلة أولاً لإتمام الطلب.
        </p>
        <Link
          href="/"
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          العودة للمتجر
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8" dir="rtl">
      <h1 className="text-3xl font-black text-gray-900 mb-8">إتمام الطلب</h1>

      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">عنوان الشحن</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="الاسم الكامل"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="العنوان السكني / المدينة"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="رقم الهاتف"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center font-bold text-lg mb-4">
            <span>المبلغ الإجمالي:</span>
            <span className="text-blue-600">{totalPrice} ر.س</span>
          </div>
          <button
            type="button"
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            تأكيد الطلب
          </button>
        </div>
      </div>
    </main>
  );
}
