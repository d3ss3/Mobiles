// context/ProductContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Product } from '@/types';

// المنتجات الافتراضية الأولية
const initialProducts: Product[] = [
  {
    id: '1',
    title: 'سماعات لاسلكية عازلة للضوضاء',
    description:
      'سماعات عالية الجودة مع خاصية إلغاء الضوضاء وبطارية تدوم 30 ساعة.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'إلكترونيات',
    stock: 10,
  },
  {
    id: '2',
    title: 'ساعة ذكية رياضية',
    description: 'تتبع اللياقة البدنية ومعدل ضربات القلب مع مقاومة للماء.',
    price: 220,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'إلكترونيات',
    stock: 15,
  },
  {
    id: '3',
    title: 'حقيبة ظهر للمحمول',
    description: 'حقيبة مريحة وعصرية مع منفذ شحن USB ومساحة واسعة.',
    price: 130,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'إكسسوارات',
    stock: 8,
  },
];

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. استرجاع قائمة المنتجات من localStorage عند التشغيل
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('app_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (error) {
      console.error('Failed to load products from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. حفظ التغييرات في localStorage عند إضافة أو تعديل أو حذف أي منتج
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('app_products', JSON.stringify(products));
      } catch (error) {
        console.error('Failed to save products to localStorage:', error);
      }
    }
  }, [products, isLoaded]);

  const addProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: Date.now().toString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
