// app/(shop)/cart/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <main
        className="min-h-[70vh] flex flex-col items-center justify-center p-8"
        dir="rtl"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          سلة التسوق فارغة
        </h2>
        <p className="text-gray-500 mb-6">لم تقم بإضافة أي منتجات للسلة بعد.</p>
        <Link
          href="/"
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          تصفح المنتجات
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8" dir="rtl">
      <h1 className="text-3xl font-black text-gray-900 mb-8">سلة التسوق</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-bold text-gray-800">
                    {item.product.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.product.price} ر.س × {item.quantity}
                  </p>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-red-500 hover:text-red-700 text-sm font-semibold p-2"
              >
                حذف
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-4">ملخص الطلب</h2>
          <div className="flex justify-between border-b pb-4 mb-4">
            <span className="text-gray-600">المجموع الكلي:</span>
            <span className="text-xl font-extrabold text-gray-900">
              {totalPrice} ر.س
            </span>
          </div>
          <Link
            href="/checkout"
            className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            متابعة الشراء
          </Link>
        </div>
      </div>
    </main>
  );
}
