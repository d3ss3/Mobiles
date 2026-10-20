// components/products/ProductCard.tsx
'use client';

import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

interface ProductCardProps {
  product: Product & {
    oem_number?: string;
    vehicles?: { brand: string; model: string; year: string | number }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div 
      className="bg-white border border-zinc-200/80 rounded-3xl overflow-hidden shadow-xl shadow-zinc-200/30 hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-300 flex flex-col justify-between group"
      dir="rtl"
    >
      <div>
        {/* حاوية الصورة مع تأثير التكبير عند التحويم */}
        <div className="relative h-52 w-full bg-zinc-100 overflow-hidden">
          <Image
            src={product.image || 'https://via.placeholder.com/300'}
            alt={product.title || (product as any).name || 'product'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {product.category && (
            <span className="absolute top-3 right-3 bg-store-accent/90 backdrop-blur-md text-store-dark text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              {product.category}
            </span>
          )}
        </div>

        {/* تفاصيل المنتج */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-store-primary bg-store-primary/10 border border-store-primary/20 px-3 py-1 rounded-full inline-block">
              {product.category}
            </span>
            {product.oem_number && (
              <span className="text-[11px] font-mono font-bold text-zinc-500 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-md">
                OEM: {product.oem_number}
              </span>
            )}
          </div>

          <h3 className="font-black text-lg text-store-dark mt-2 line-clamp-1 group-hover:text-store-primary transition-colors">
            {product.title || (product as any).name}
          </h3>

          {/* السيارات والموديلات المتوافقة */}
          {product.vehicles && product.vehicles.length > 0 && (
            <div className="mt-3 space-y-1 bg-zinc-50 p-2.5 rounded-2xl border border-zinc-100">
              <div className="text-[11px] font-bold text-zinc-400">السيارات المتوافقة:</div>
              <div className="flex flex-wrap gap-1">
                {product.vehicles.slice(0, 2).map((veh, idx) => (
                  <span 
                    key={idx}
                    className="bg-white text-store-dark text-[10px] font-bold px-2 py-1 rounded-lg border border-zinc-200 shadow-2xs"
                  >
                    {veh.brand} {veh.model} ({veh.year})
                  </span>
                ))}
                {product.vehicles.length > 2 && (
                  <span className="text-[10px] text-store-primary font-bold self-center px-1">
                    +{product.vehicles.length - 2} أخرى
                  </span>
                )}
              </div>
            </div>
          )}

          <p className="text-zinc-500 text-sm mt-3 line-clamp-2 leading-relaxed font-medium">
            {product.description}
          </p>
        </div>
      </div>

      {/* السعر وزر الإضافة للسلة */}
      <div className="p-6 pt-0 flex items-center justify-between mt-2">
        <div>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
            السعر
          </span>
          <span className="text-xl font-black text-store-dark mt-0.5 inline-block">
            {product.price} <span className="text-xs font-bold text-store-primary">ر.س</span>
          </span>
        </div>
        <button
          onClick={() => addToCart(product)}
          className="bg-store-primary hover:bg-store-secondary text-white text-sm font-bold px-5 py-2.5 rounded-2xl shadow-lg shadow-store-primary/25 transition-all active:scale-[0.98] cursor-pointer"
        >
          إضافة للسلة
        </button>
      </div>
    </div>
  );
}