// components/products/ProductDrawer.tsx
'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

interface ProductDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDrawer({
  product,
  isOpen,
  onClose,
}: ProductDrawerProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setAdded(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        title: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
    setAdded(quantity);
    setTimeout(() => {
      setAdded(0);
    }, 2000);
  };

  return (
    // تم تغيير الـ z-index إلى 100 ليتخطى أي نافبار مثبت في الموقع
    <div className="fixed inset-0 z-[100] overflow-hidden" dir="rtl">
      {/* خلفية معتمة بالكامل تغطي الشاشة وتمنع تفاعل ما خلفها */}
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* صندوق تفاصيل المنتج الجانبي */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 z-[101]">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-r border-slate-100">
          {/* رأس السلايدر */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <h2 className="font-extrabold text-slate-900 text-base">
              تفاصيل المنتج
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* محتوى الصندوق (بدون أشرطة تمرير مزعجة وبشكل مرتب) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* صورة المنتج */}
            <div className="relative w-full h-64 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm group">
              <img
                src={product.image || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.category && (
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  {product.category}
                </span>
              )}
            </div>

            {/* العنوان والسعر */}
            <div className="space-y-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {product.name}
              </h1>
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl font-black text-xl">
                <span>{product.price}</span>
                <span className="text-xs font-bold">ر.س</span>
              </div>
            </div>

            {/* الوصف */}
            {product.description && (
              <div className="space-y-2 bg-slate-50/70 p-4.5 rounded-2xl border border-slate-100/80">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  وصف المنتج
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* تذييل الصندوق (الكمية وزر الإضافة) */}
          <div className="p-6 bg-white border-t border-slate-100 space-y-4 shrink-0 shadow-lg">
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500 mr-2">
                الكمية:
              </span>
              <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center font-black text-slate-900 text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-2xl font-extrabold text-sm shadow-md transition-all active:scale-[0.98] ${
                added > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
              }`}
            >
              {added > 0
                ? `تمت إضافة ${added} منتج للسلة بنجاح ✓`
                : `إضافة للسلة (${product.price * quantity} ر.س)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
