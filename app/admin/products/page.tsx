// app/admin/products/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/db';
import { Product } from '@/types';

export default function AdminProductsPage() {

  // حالات البيانات والتحميل
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // حالات التحكم في الواجهة (UI States)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>(
    'newest'
  );

  // حالات الـ Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // حالة النموذج
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'إلكترونيات',
    stock: '',
    image: '',
  });

  const [allCategories, setAllCategories] = useState<string[]>([]);

  // جلب المنتجات من قاعدة البيانات عند تحميل الصفحة

  useEffect(() => {
    fetchProducts();
    fetchCategoriesList(); // جلب قائمة الشركات المستقلة
  }, []);

  const fetchCategoriesList = async () => {
    try {
      // استبدل 'categories' باسم جدول الشركات أو التصنيفات الحقيقي لديك في Supabase
      const { data, error } = await supabase.from('categories').select('name'); // أو select('*') حسب اسم العمود لديك
      
      if (error) throw error;
      if (data) {
        // استخراج الأسماء وضمان عدم تكرارها
        const names = data.map((item: any) => item.name || item.title);
        setAllCategories(names);
      }
    } catch (error) {
      console.error('خطأ في جلب قائمة الشركات:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setProducts(data);
    } catch (error: any) {
      console.error('خطأ في جلب المنتجات:', error.message);
      alert('فشل جلب المنتجات من قاعدة البيانات');
    } finally {
      setLoading(false);
    }
  };

  // حساب الإحصائيات العامة ديناميكياً
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, p) => sum + (p.price || 0) * (p.stock || 0),
      0
    );
    const lowStockCount = products.filter(
      (p) => (p.stock || 0) > 0 && (p.stock || 0) <= 5
    ).length;
    const outOfStockCount = products.filter((p) => (p.stock || 0) === 0).length;

    return { totalProducts, totalValue, lowStockCount, outOfStockCount };
  }, [products]);

  // تصفية وترتيب المنتجات ديناميكياً
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  const dynamicCategories = useMemo(() => {
    const categoriesSet = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(categoriesSet) as string[];
  }, [products]);
  
  // فتح نافذة الإضافة
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      category: 'إلكترونيات',
      stock: '10',
      image:
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500',
    });
    setIsModalOpen(true);
  };

  // فتح نافذة التعديل
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: product.price ? product.price.toString() : '',
      category: product.category || 'إلكترونيات',
      stock: product.stock !== undefined ? product.stock.toString() : '0',
      image: product.image || '',
    });
    setIsModalOpen(true);
  };

  // حفظ بيانات المنتج (إضافة أو تعديل في قاعدة البيانات)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.price) {
      alert('يرجى تعبئة الحقول الأساسية المطلوبة');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      category: formData.category,
      stock: Number(formData.stock) || 0,
      image:
        formData.image.trim() ||
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500',
    };

    try {
      if (editingProduct) {
        // تحديث منتج موجود
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        // إضافة منتج جديد
        const { error } = await supabase
          .from('products')
          .insert([payload]);

        if (error) throw error;
      }

      // إعادة جلب المنتجات لتحديث الواجهة فوراً
      await fetchProducts();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('خطأ أثناء حفظ المنتج:', error.message);
      alert('حدث خطأ أثناء حفظ المنتج في قاعدة البيانات: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // حذف المنتج من قاعدة البيانات
  const handleDeleteProduct = async (id: string | number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج نهائياً من قاعدة البيانات؟')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // تحديث الحالة المحلية لحذف العنصر فوراً دون الحاجة لإعادة تحميل كاملة
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      console.error('خطأ أثناء حذف المنتج:', error.message);
      alert('فشل حذف المنتج من قاعدة البيانات');
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-store-light text-store-dark p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 1. الهيدر الرئيسي وزر الإضافة */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-store-primary animate-pulse"></span>
              <h1 className="text-2xl font-black text-store-dark">
                إدارة المنتجات والمخزون (قاعدة البيانات)
              </h1>
            </div>
            <p className="text-zinc-500 text-sm mt-1 font-medium">
              لوحة تحكم مرتبطة مباشرة بقاعدة البيانات الحية لتنظيم المخزون والمنتجات.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="bg-store-primary hover:bg-store-secondary text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-store-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <span className="text-xl leading-none">+</span>
            <span>إضافة منتج جديد</span>
          </button>
        </div>

        {/* 2. بطاقات الإحصائيات الحية (KPI Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                إجمالي المنتجات
              </p>
              <h3 className="text-2xl font-black text-store-dark mt-1">
                {stats.totalProducts}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-store-primary/10 text-store-primary flex items-center justify-center font-black text-lg border border-store-primary/20">
              📦
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                قيمة المخزون الإجمالية
              </p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">
                {stats.totalValue.toLocaleString('ar-SA')} ر.س
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg border border-emerald-200">
              💰
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                مخزون منخفض (≤ 5)
              </p>
              <h3 className="text-2xl font-black text-amber-500 mt-1">
                {stats.lowStockCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg border border-amber-200">
              ⚠️
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                نفذ من المخزون
              </p>
              <h3 className="text-2xl font-black text-rose-600 mt-1">
                {stats.outOfStockCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-lg border border-rose-200">
              🚫
            </div>
          </div>
        </div>

        {/* 3. شريط أدوات التحكم والفلترة */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المنتج أو الوصف..."
              className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm font-medium text-store-dark outline-none focus:border-store-primary focus:bg-white focus:ring-4 focus:ring-store-primary/15 transition-all placeholder:text-zinc-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 top-3 text-zinc-400 hover:text-zinc-600 text-sm font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
          <div>
  <label className="block text-sm font-bold text-zinc-700 mb-2">اسم الشركة / التصنيف</label>
  <input
    type="text"
    name="category"
    value={formData.category}
    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
    placeholder="مثال: شانجان، جيلي، شيري، هافال، إم جي..."
    required
    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-store-primary bg-white text-zinc-800 font-medium"
  />
</div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-50/50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm font-medium text-store-dark outline-none focus:border-store-primary focus:bg-white focus:ring-4 focus:ring-store-primary/15 transition-all cursor-pointer"
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
            </select>

            <div className="bg-zinc-100 p-1 rounded-2xl flex items-center gap-1 border border-zinc-200/80">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-store-primary shadow-sm'
                    : 'text-zinc-500 hover:text-store-dark'
                }`}
              >
                جدول
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-store-primary shadow-sm'
                    : 'text-zinc-500 hover:text-store-dark'
                }`}
              >
                شبكي
              </button>
            </div>
          </div>
        </div>

        {/* 4. عرض المحتوى (حالة التحميل أو البيانات) */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-zinc-200 shadow-sm">
            <div className="w-10 h-10 border-4 border-store-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-bold text-zinc-500">جاري تحميل المنتجات من قاعدة البيانات...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-zinc-300 shadow-sm">
            <div className="w-16 h-16 bg-store-primary/10 text-store-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl border border-store-primary/20">
              📭
            </div>
            <h3 className="text-lg font-bold text-store-dark mb-1">لا توجد منتجات مطابقة</h3>
            <p className="text-sm font-medium text-zinc-400">
              لم يتم العثور على أية منتجات في قاعدة البيانات تطابق بحثك.
            </p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                    <th className="p-4">المنتج</th>
                    <th className="p-4">التصنيف</th>
                    <th className="p-4">السعر</th>
                    <th className="p-4">المخزون</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm font-medium">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-12 h-12 rounded-2xl object-cover border border-zinc-200 bg-zinc-100 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-store-dark block">
                              {product.title}
                            </span>
                            <span className="text-xs text-zinc-400 line-clamp-1 font-normal">
                              {product.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block bg-store-primary/10 text-store-primary text-xs font-bold px-3 py-1 rounded-full border border-store-primary/20">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 font-black text-store-dark">
                        {product.price?.toLocaleString('ar-SA')} ر.س
                      </td>
                      <td className="p-4">
                        {product.stock === 0 ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                            منتهي
                          </span>
                        ) : (product.stock || 0) <= 5 ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
                            مخزون منخفض ({product.stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            متوفر ({product.stock})
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="px-3 py-1.5 text-zinc-600 hover:text-store-primary hover:bg-store-primary/5 rounded-xl transition-colors font-bold text-xs cursor-pointer"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="px-3 py-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-bold text-xs cursor-pointer"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all"
              >
                <div className="p-5">
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-zinc-100 mb-4 border border-zinc-200">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-store-dark text-xs font-bold px-3 py-1 rounded-full border border-zinc-200/50 shadow-sm">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-store-dark text-base mb-1">
                    {product.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-4 font-medium">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                    <span className="text-lg font-black text-store-dark">
                      {product.price} ر.س
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      المخزون: {product.stock}
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-50/50 p-4 border-t border-zinc-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEditModal(product)}
                    className="flex-1 bg-white border border-zinc-200 text-store-dark py-2.5 rounded-2xl text-xs font-bold hover:bg-zinc-50 transition-colors shadow-sm cursor-pointer"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-4 py-2.5 text-rose-600 hover:bg-rose-50 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. النافذة المنبثقة للنموذج (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-store-dark/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl border border-zinc-200/80 my-8">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-store-dark">
                  {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-medium">
                  سيتم حفظ التغييرات مباشرة في قاعدة البيانات
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  اسم المنتج *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl p-3 text-sm font-medium text-store-dark outline-none focus:border-store-primary focus:bg-white focus:ring-4 focus:ring-store-primary/15 transition-all"
                  placeholder="مثال: سماعة رأس لاسلكية"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    السعر (ر.س) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl p-3 text-sm font-medium text-store-dark outline-none focus:border-store-primary focus:bg-white focus:ring-4 focus:ring-store-primary/15 transition-all"
                    placeholder="250"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    الكمية بالمخزون
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl p-3 text-sm font-medium text-store-dark outline-none focus:border-store-primary focus:bg-white focus:ring-4 focus:ring-store-primary/15 transition-all"
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
    اسم الشركة / التصنيف *
  </label>
  <select
  name="category"
  value={formData.category}
  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
  required
  className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl p-3 text-sm font-medium text-store-dark outline-none focus:border-store-primary focus:bg-white focus:ring-4 focus:ring-store-primary/15 transition-all cursor-pointer"
>
  <option value="" disabled>اختر الشركة أو التصنيف...</option>
  {allCategories.length > 0 ? (
    allCategories.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))
  ) : (
    // كاحتياط في حال لم يتم جلب الجدول بعد، تعرض المنتجات الحالية
    dynamicCategories.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))
  )}
</select>
  <p className="text-[11px] text-zinc-400 mt-1">
    تظهر في هذه القائمة الشركات والتصنيفات المسجلة مسبقاً في قاعدة بيانات المنتجات.
  </p>
</div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  رابط الصورة (Image URL)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl p-3 text-sm font-medium text-store-dark outline-none focus:border-store-primary focus:bg-white focus:ring-4 focus:ring-store-primary/15 transition-all"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  وصف المنتج
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl p-3 text-sm font-medium text-store-dark outline-none focus:border-store-primary focus:bg-white focus:ring-4 focus:ring-store-primary/15 transition-all resize-none"
                  placeholder="اكتب وصفاً موجزاً للمنتج..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-2xl border border-zinc-200 text-zinc-600 font-bold text-sm hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-store-primary hover:bg-store-secondary text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-store-primary/25 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'جاري الحفظ...'
                    : editingProduct
                    ? 'حفظ التغييرات'
                    : 'تأكيد إضافة المنتج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}