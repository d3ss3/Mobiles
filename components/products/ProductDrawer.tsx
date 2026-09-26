// components/products/ProductDrawer.tsx
'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { createPortal } from 'react-dom';

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
  if (typeof document === 'undefined') return null;

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

  return createPortal(
    (
      <div
        className="fixed inset-0 z-[9999]"
        dir="rtl"
      >
        {/* الخلفية */}
        <div
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-[3px]"
          onClick={onClose}
        />
  
        {/* السلايدر */}
        <aside className="absolute inset-y-0 right-0 z-[10000] flex w-full max-w-[460px] flex-col bg-white shadow-2xl">
  
          {/* Header */}
          <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5">
            <h2 className="text-base font-extrabold text-slate-900">
              تفاصيل المنتج
            </h2>
  
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
            >
              ×
            </button>
          </header>
  
          {/* المحتوى */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-5 p-5">
  
              <div className="relative w-full overflow-hidden rounded-[24px] bg-slate-50">
                <div className="h-[240px] w-full sm:h-[260px]">
                  <img
                    src={product.image || 'https://via.placeholder.com/600'}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
  
                {product.category && (
                  <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3.5 py-2 text-xs font-bold text-slate-800 shadow-md">
                    {product.category}
                  </span>
                )}
              </div>
  
              <div>
                <h1 className="text-[22px] font-black leading-[1.4] text-slate-900">
                  {product.name}
                </h1>
  
                <div className="mt-3 inline-flex items-baseline gap-1.5 rounded-2xl bg-blue-50 px-4 py-2 text-blue-600">
                  <span className="text-2xl font-black">
                    {product.price.toLocaleString('ar-SA')}
                  </span>
                  <span className="text-xs font-bold">ر.س</span>
                </div>
              </div>
  
              {product.description && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <h3 className="mb-2 text-sm font-extrabold text-slate-900">
                    وصف المنتج
                  </h3>
  
                  <p className="text-sm leading-7 text-slate-600">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
  
          {/* Footer */}
          <footer className="shrink-0 border-t border-slate-100 bg-white p-5 shadow-[0_-8px_25px_rgba(15,23,42,0.07)]">
  
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <span className="text-sm font-bold text-slate-600">
                الكمية
              </span>
  
              <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity === 1}
                  className="flex h-10 w-10 items-center justify-center text-lg font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                >
                  −
                </button>
  
                <span className="flex h-10 w-12 items-center justify-center border-x border-slate-100 text-sm font-black text-slate-900">
                  {quantity}
                </span>
  
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center text-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>
  
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full rounded-2xl py-4 text-sm font-extrabold text-white shadow-lg transition-all active:scale-[0.98] ${
                added > 0
                  ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700'
                  : 'bg-blue-600 shadow-blue-200 hover:bg-blue-700'
              }`}
            >
              {added > 0
                ? `تمت إضافة ${added} منتج للسلة ✓`
                : `إضافة للسلة — ${totalPrice.toLocaleString('ar-SA')} ر.س`}
            </button>
          </footer>
        </aside>
        </div>
    ),
    document.body
  );
}