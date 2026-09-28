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
import { supabase } from '@/lib/db'; // ملف الاتصال بقاعدة البيانات

interface Category {
  id: string | number;
  name: string;
  slug?: string;
  [key: string]: any;
}

interface ProductContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب المنتجات والتصنيفات الحقيقية من Supabase عند التحميل
  useEffect(() => {
    async function fetchStoreData() {
      try {
        setLoading(true);

        // 1. جلب التصنيفات من جدول categories
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*');

        if (catError) {
          console.error('Error fetching categories:', catError);
        } else {
          setCategories(catData || []);
        }

        // 2. جلب المنتجات من جدول products وترتيبها بالأحدث
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (prodError) {
          console.error('Error fetching products:', prodError);
        } else {
          setProducts(prodData || []);
        }
      } catch (err) {
        console.error('Unexpected error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStoreData();
  }, []);

  // إضافة منتج جديد إلى جدول products في Supabase
  const addProduct = async (newProductData: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([newProductData])
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error);
        alert('حدث خطأ أثناء إضافة المنتج لقاعدة البيانات');
        return;
      }

      if (data) {
        setProducts((prev) => [data, ...prev]);
      }
    } catch (err) {
      console.error('Unexpected error adding product:', err);
    }
  };

  // تعديل منتج في جدول products في Supabase
  const updateProduct = async (id: string, updatedData: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updatedData)
        .eq('id', id);

      if (error) {
        console.error('Error updating product:', error);
        alert('حدث خطأ أثناء تحديث المنتج');
        return;
      }

      setProducts((prev) =>
        prev.map((p) => (String(p.id) === id ? { ...p, ...updatedData } : p))
      );
    } catch (err) {
      console.error('Unexpected error updating product:', err);
    }
  };

  // حذف منتج من جدول products في Supabase
  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        alert('حدث خطأ أثناء حذف المنتج');
        return;
      }

      setProducts((prev) => prev.filter((p) => String(p.id) !== id));
    } catch (err) {
      console.error('Unexpected error deleting product:', err);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
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