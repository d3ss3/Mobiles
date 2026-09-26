// app/admin/products/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useProducts } from '@/context/ProductContext';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

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

  // حساب الإحصائيات العامة ديناميكياً
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, p) => sum + p.price * (p.stock || 0),
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
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return Number(b.id) - Number(a.id); // الافتراضي: الأحدث
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

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
      title: product.title,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      stock: (product.stock ?? 0).toString(),
      image: product.image,
    });
    setIsModalOpen(true);
  };

  // حفظ بيانات المنتج
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.price) {
      alert('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      category: formData.category,
      stock: Number(formData.stock),
      image:
        formData.image.trim() ||
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500',
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    setIsModalOpen(false);
  };

  // حذف المنتج
  const handleDeleteProduct = (id: string) => {
    if (confirm('هل أنت تأكد من حذف هذا المنتج نهائياً؟')) {
      deleteProduct(id);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. الهيدر الرئيسي وزر الإضافة */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></span>
              <h1 className="text-2xl font-black text-slate-900">
                إدارة المنتجات والمخزون
              </h1>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              لوحة تحكم ذكية لتنظيم واستعراض جميع منتجات المتجر وتحديد المخزون.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            <span className="text-xl leading-none">+</span>
            <span>إضافة منتج جديد</span>
          </button>
        </div>

        {/* 2. بطاقات الإحصائيات الحية (KPI Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                إجمالي المنتجات
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {stats.totalProducts}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg">
              📦
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                قيمة المخزون الإجمالية
              </p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">
                {stats.totalValue.toLocaleString()} ر.س
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg">
              💰
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                مخزون منخفض (≤ 5)
              </p>
              <h3 className="text-2xl font-black text-amber-500 mt-1">
                {stats.lowStockCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg">
              ⚠️
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                نفذ من المخزون
              </p>
              <h3 className="text-2xl font-black text-rose-600 mt-1">
                {stats.outOfStockCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-lg">
              🚫
            </div>
          </div>
        </div>

        {/* 3. شريط أدوات التحكم والفلترة */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          {/* البحث */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المنتج أو الوصف..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* الخيارات والتصنيف والتبديل */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-blue-600"
            >
              <option value="all">جميع التصنيفات</option>
              <option value="إلكترونيات">إلكترونيات</option>
              <option value="إكسسوارات">إكسسوارات</option>
              <option value="ملابس">ملابس</option>
              <option value="أدوات منزلية">أدوات منزلية</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-blue-600"
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
            </select>

            {/* أزرار التبديل بين Grid و Table */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                جدول
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                شبكي
              </button>
            </div>
          </div>
        </div>

        {/* 4. عرض المحتوى (Table / Grid) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
            <p className="text-slate-400 text-lg font-medium">
              لم يتم العثور على أية منتجات مطابقة للبحث.
            </p>
          </div>
        ) : viewMode === 'table' ? (
          /* جدول البيانات العصري */
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <th className="p-4">المنتج</th>
                    <th className="p-4">التصنيف</th>
                    <th className="p-4">السعر</th>
                    <th className="p-4">المخزون</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {product.title}
                            </span>
                            <span className="text-xs text-slate-400 line-clamp-1">
                              {product.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-lg">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 font-black text-slate-900">
                        {product.price.toLocaleString()} ر.س
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
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-bold text-xs"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-bold text-xs"
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
          /* العرض الشبكي (Cards Grid View) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="p-4">
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-slate-100">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-lg font-black text-slate-900">
                      {product.price} ر.س
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      المخزون: {product.stock}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEditModal(product)}
                    className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. النافذة المنبثقة (Dynamic Glassmorphic Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  قم بتعبئة بيانات المنتج للتحديث الفوري في المتجر
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم المنتج *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all"
                  placeholder="مثال: سماعة رأس لاسلكية"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    السعر (ر.س) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all"
                    placeholder="250"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الكمية بالمخزون
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all"
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  التصنيف
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all"
                >
                  <option value="إلكترونيات">إلكترونيات</option>
                  <option value="إكسسوارات">إكسسوارات</option>
                  <option value="ملابس">ملابس</option>
                  <option value="أدوات منزلية">أدوات منزلية</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رابط الصورة (Image URL)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  وصف المنتج
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all resize-none"
                  placeholder="اكتب وصفاً موجزاً للمنتج..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-500/20"
                >
                  {editingProduct ? 'حفظ التغييرات' : 'تأكيد إضافة المنتج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
