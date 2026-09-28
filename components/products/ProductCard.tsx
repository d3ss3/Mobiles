// components/products/ProductCard.tsx
'use client';

import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
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
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* تفاصيل المنتج */}
        <div className="p-6">
          <span className="text-xs font-bold text-store-primary bg-store-primary/10 border border-store-primary/20 px-3 py-1 rounded-full inline-block">
            {product.category}
          </span>
          <h3 className="font-black text-lg text-store-dark mt-3 line-clamp-1 group-hover:text-store-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-zinc-500 text-sm mt-1.5 line-clamp-2 leading-relaxed font-medium">
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