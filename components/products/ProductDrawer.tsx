// components/products/ProductDrawer.tsx
'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { createPortal } from 'react-dom';
import Image from 'next/image';

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
        id: String(product.id),
        title: product.name,
        price: product.price,
        image: product.image,
        category: product.category || '',
        description: product.description || '',
        stock: 10,
      });
    }
    setAdded(quantity);
    setTimeout(() => {
      setAdded(0);
    }, 2000);
  };

  const totalPrice = product.price * quantity;

  return createPortal(
    (
      <div
        className="fixed inset-0 z-[9999]"
        dir="rtl"
      >
        {/* الخلفية */}
        <div
          className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[3px] transition-opacity"
          onClick={onClose}
        />
  
        {/* السلايدر */}
        <aside className="absolute inset-y-0 right-0 z-[10000] flex w-full max-w-[460px] flex-col bg-white shadow-2xl border-l border-zinc-200/80">
  
          {/* Header */}
          <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-zinc-200/80 bg-white px-6">
            <h2 className="text-lg font-black text-store-dark tracking-tight">
              تفاصيل المنتج
            </h2>
  
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-lg font-bold text-zinc-600 transition hover:bg-zinc-200 hover:text-store-dark cursor-pointer"
            >
              ×
            </button>
          </header>
  
          {/* المحتوى */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-6 p-6">
  
              <div className="relative w-full overflow-hidden rounded-3xl bg-zinc-100 border border-zinc-200/60">
                <div className="relative h-[260px] w-full sm:h-[280px]">
                  <Image
                    src={product.image || 'https://via.placeholder.com/600'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 460px"
                    priority
                    className="object-cover"
                  />
                </div>

                {product.category && (
                  <span className="absolute right-4 top-4 z-10 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-store-dark shadow-md border border-zinc-200/60">
                    {product.category}
                  </span>
                )}
              </div>
  
              <div>
                <h1 className="text-xl sm:text-2xl font-black leading-snug text-store-dark tracking-tight">
                  {product.name}
                </h1>
  
                <div className="mt-4 inline-flex items-baseline gap-2 rounded-2xl bg-store-primary/10 border border-store-primary/20 px-4 py-2.5 text-store-primary">
                  <span className="text-2xl font-black">
                    {product.price.toLocaleString('ar-SA')}
                  </span>
                  <span className="text-xs font-bold">ر.س</span>
                </div>
              </div>
  
              {product.description && (
                <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/80 p-5 shadow-sm">
                  <h3 className="mb-2 text-sm font-black text-store-dark">
                    وصف المنتج
                  </h3>
  
                  <p className="text-sm leading-7 text-zinc-600 font-medium">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
  
          {/* Footer */}
          <footer className="shrink-0 border-t border-zinc-200/80 bg-white p-6 shadow-2xl">
  
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-zinc-50 px-5 py-3">
              <span className="text-sm font-bold text-zinc-600">
                الكمية
              </span>
  
              <div className="flex items-center overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity === 1}
                  className="flex h-10 w-10 items-center justify-center text-lg font-bold text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                >
                  −
                </button>
  
                <span className="flex h-10 w-12 items-center justify-center border-x border-zinc-200 text-sm font-black text-store-dark">
                  {quantity}
                </span>
  
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center text-lg font-bold text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
  
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full rounded-2xl py-4 text-sm font-bold shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
                added > 0
                  ? 'bg-emerald-600 text-white shadow-emerald-600/25 hover:bg-emerald-700'
                  : 'bg-store-primary text-white shadow-store-primary/25 hover:bg-store-secondary'
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