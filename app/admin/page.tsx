'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/db'; // استيراد اتصال Supabase

export default function AdminDashboardPage() {
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // جلب إحصائيات المنتجات من قاعدة البيانات عند تحميل الصفحة
  useEffect(() => {
    async function fetchStats() {
      try {
        // جلب عدد المنتجات الفعلية من جدول products
        const { count, error } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        if (error) throw error;
        setTotalProducts(count || 0);
      } catch (err) {
        console.error('خطأ في جلب الإحصائيات:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-store-light text-store-dark p-6 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* الهيدر الرئيسي */}
        <header className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-store-primary animate-pulse"></span>
              <h1 className="text-2xl sm:text-3xl font-black text-store-dark tracking-tight">
                لوحة تحكم الإدارة
              </h1>
            </div>
            <p className="text-zinc-500 text-sm mt-1 font-medium">
              نظرة عامة على المبيعات والمنتجات وحالة المتجر
            </p>
          </div>
          <Link
            href="/admin/products"
            className="bg-store-primary hover:bg-store-secondary text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-store-primary/25 transition-all active:scale-[0.98] flex items-center gap-2 text-sm cursor-pointer"
          >
            <span>+ إدارة المنتجات والمخزون</span>
          </Link>
        </header>

        {/* بطاقات الإحصائيات (KPI Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* بطاقة المبيعات (يمكن ربطها لاحقاً بجدول الطلبات) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                إجمالي المبيعات
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-store-dark mt-2">
                1,250 <span className="text-sm font-bold text-store-primary">ر.س</span>
              </h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-store-primary/10 text-store-primary flex items-center justify-center font-black text-xl border border-store-primary/20">
              📈
            </div>
          </div>

          {/* بطاقة الطلبات (يمكن ربطها لاحقاً بجدول الطلبات) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                عدد الطلبات
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-store-dark mt-2">
                12 <span className="text-sm font-bold text-zinc-500">طلب</span>
              </h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl border border-emerald-200">
              🛒
            </div>
          </div>

          {/* بطاقة إجمالي المنتجات (مرتبطة الآن بقاعدة البيانات بشكل حقيقي!) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                إجمالي المنتجات
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-store-dark mt-2">
                {loading ? '...' : totalProducts}{' '}
                <span className="text-sm font-bold text-zinc-500">منتج</span>
              </h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl border border-amber-200">
              📦
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}