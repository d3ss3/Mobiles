// components/products/ProductCard.tsx
'use client';

import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
      <div>
        <div className="relative h-48 w-full bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {product.category}
          </span>
          <h3 className="font-bold text-lg text-gray-800 mt-2 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 flex items-center justify-between mt-4">
        <div>
          <span className="text-xs text-gray-400 block">السعر</span>
          <span className="text-xl font-extrabold text-gray-900">
            {product.price} ر.س
          </span>
        </div>
        <button
          onClick={() => addToCart(product)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          إضافة للسلة
        </button>
      </div>
    </div>
  );
}
