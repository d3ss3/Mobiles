// app/(shop)/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cart, totalPrice } = useCart();
  
  // حالات نموذج الدفع
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: 'الرياض',
    address: '',
    paymentMethod: 'cod', // cod: الدفع عند الاستلام, card: بطاقة ائتمانية
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState('');

  // حساب تكلفة الشحن (مجاني إذا تجاوز المجموع 200 ريال، وإلا 25 ريال)
  const shippingFee = totalPrice >= 200 ? 0 : 25;
  const finalTotal = totalPrice + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // محاكاة إرسال الطلب للسيرفر
    setTimeout(() => {
      const randomId = '#ORD-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(randomId);
      setIsSubmitting(false);
      setOrderCompleted(true);
    }, 1500);
  };

  // 1. إذا تم إتمام الطلب بنجاح
  if (orderCompleted) {
    return (
      <main className="min-h-[75vh] flex flex-col items-center justify-center p-6 max-w-xl mx-auto text-center" dir="rtl">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">شكراً لك، تم طلبك بنجاح!</h1>
        <p className="text-slate-600 mb-6">
          رقم الطلب الخاص بك هو <span className="font-bold text-blue-600">{orderId}</span>. سنقوم بالتواصل معك قريباً لتأكيد الشحن.
        </p>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 w-full text-right mb-8">
          <h3 className="font-bold text-slate-800 mb-3">تفاصيل التوصيل:</h3>
          <p className="text-sm text-slate-600 mb-1">الاسم: {formData.fullName}</p>
          <p className="text-sm text-slate-600 mb-1">المدينة: {formData.city} - {formData.address}</p>
          <p className="text-sm text-slate-600">الجوال: {formData.phone}</p>
        </div>
        <Link
          href="/"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-blue-200"
        >
          العودة للتسوق
        </Link>
      </main>
    );
  }

  // 2. إذا كانت السلة فارغة
  if (cart.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center" dir="rtl">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">سلة التسوق فارغة</h2>
        <p className="text-slate-500 mb-6">أضف بعض المنتجات الرائعة إلى سلتك أولاً لإتمام الطلب.</p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md"
        >
          تصفح المنتجات
        </Link>
      </main>
    );
  }

  // 3. صفحة الدفع الأساسية
  return (
    <main className="max-w-7xl mx-auto px-4 py-10" dir="rtl">
      <h1 className="text-3xl font-black text-slate-900 mb-8">إتمام الطلب والدفع</h1>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* القسم الأيمن: بيانات الشحن وطريقة الدفع (7 أعمدة) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* بيانات الشحن */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
              معلومات الشحن والاستلام
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">الاسم الكامل</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="محمد أحمد"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الجوال</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0500000000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">المدينة</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 text-sm"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="مكة المكرمة">مكة المكرمة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="المدينة المنورة">المدينة المنورة</option>
                    <option value="أخرى">مدينة أخرى</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">العنوان بالتفصيل (الحي، الشارع، رقم المبنى)</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="حي الياسمين، شارع الملك عبد العزيز"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 text-sm"
                />
              </div>
            </div>
          </div>

          {/* طريـقة الدفع */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
              طريقة الدفع
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 hover:border-slate-200'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <span className="block font-bold text-slate-900 text-sm">الدفع عند الاستلام</span>
                  <span className="text-xs text-slate-500">ادفع نقداً عند استلام طلبك</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 hover:border-slate-200'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <span className="block font-bold text-slate-900 text-sm">بطاقة ائتمانية / مدى</span>
                  <span className="text-xs text-slate-500">دفع إلكتروني آمن</span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* القسم الأيسر: ملخص الطلب والأسعار (5 أعمدة) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 sticky top-6">
          <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">
            ملخص الطلب ({cart.length} منتجات)
          </h2>

          {/* قائمة المنتجات المصغرة */}
          <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                    <Image
                      src={(item as any).image || 'https://via.placeholder.com/100'}
                      alt={(item as any).title || (item as any).name || 'Product'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">
                      {(item as any).title || (item as any).name}
                    </h4>
                    <span className="text-[11px] text-slate-500">الكمية: {item.quantity || 1}</span>
                  </div>
                </div>
                <span className="font-extrabold text-xs text-slate-900">
                {(((item as any).price || 0) * (item.quantity || 1)).toLocaleString('ar-SA')} ر.س
                </span>
              </div>
            ))}
          </div>

          {/* الحسابات المالية */}
          <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>مجموع المنتجات</span>
              <span className="font-bold text-slate-900">{totalPrice.toLocaleString('ar-SA')} ر.س</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>رسوم الشحن</span>
              <span className="font-bold">
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-black">مجاني 🎉</span>
                ) : (
                  `${shippingFee} ر.س`
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
              <span>المبلغ الإجمالي</span>
              <span className="text-blue-600 text-xl">{finalTotal.toLocaleString('ar-SA')} ر.س</span>
            </div>
          </div>

          {/* زر التأكيد */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-base"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري تنفيذ الطلب...
              </>
            ) : (
              `تأكيد الطلب (${finalTotal.toLocaleString('ar-SA')} ر.س)`
            )}
          </button>
        </div>

      </form>
    </main>
  );
}