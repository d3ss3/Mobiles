'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/db';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import ProductDrawer from '@/components/products/ProductDrawer';
import TestimonialsTicker from '@/components/TestimonialsTicker';

export default function HomePage() {
  const router = useRouter();
  const { products } = useProducts();
  const { addToCart } = useCart();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // حالات البحث المتطور (OEM / VIN)
  const [searchMode, setSearchMode] = useState<'oem' | 'vin'>('oem');
  const [searchQuery, setSearchQuery] = useState('');

  // حالات محدد السيارة الذكي
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const banners = [
    "/images/banner1.png",
    "/images/banner2.png",
    "/images/banner3.jpg",
  ];

  // معالجة البحث والتوجيه المباشر لصفحة المنتجات
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchMode === 'oem') {
      router.push(`/products?oem=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/products?vin=${encodeURIComponent(searchQuery.trim().toUpperCase())}`);
    }
  };

  // 1. جلب جميع الشركات من جدول categories الأساسي
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (data) {
        setCategories(data);
      }
    }
    fetchCategories();

    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // 2. جلب الموديلات من جدول vehicles بناءً على اسم الشركة المختارة
  useEffect(() => {
    async function fetchModels() {
      if (!selectedBrand) {
        setAvailableModels([]);
        setSelectedModel('');
        setSelectedYear('');
        return;
      }

      setLoadingModels(true);
      try {
        // استخراج الاسم الإنجليزي من بين القوسين (مثل Changan من "شانجان (Changan)")
        const match = selectedBrand.match(/\(([^)]+)\)/);
        const englishBrand = match ? match[1].trim() : selectedBrand;
        const arabicPart = selectedBrand.split('(')[0].trim();

        // البحث بمرونة إما بالاسم الإنجليزي أو العربي
        const { data, error } = await supabase
          .from('vehicles')
          .select('model')
          .or(`brand.ilike.%${englishBrand}%,brand.ilike.%${arabicPart}%`);

        if (error) throw error;

        if (data) {
          const uniqueModels = Array.from(
            new Set(data.map((item) => item.model).filter(Boolean))
          ) as string[];
          
          setAvailableModels(uniqueModels);
        }
      } catch (err) {
        console.error('Error fetching models:', err);
      } finally {
        setLoadingModels(false);
      }
    }

    fetchModels();
  }, [selectedBrand]);

  // 3. جلب السنوات من جدول vehicles بناءً على الشركة والموديل
  useEffect(() => {
    async function fetchYears() {
      if (!selectedBrand || !selectedModel) {
        setAvailableYears([]);
        setSelectedYear('');
        return;
      }

      setLoadingYears(true);
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('year')
          .ilike('model', selectedModel);

        if (error) throw error;

        if (data) {
          const uniqueYears = Array.from(
            new Set(data.map((item) => item.year).filter(Boolean))
          ) as string[];

          setAvailableYears(uniqueYears);
        }
      } catch (err) {
        console.error('Error fetching years:', err);
      } finally {
        setLoadingYears(false);
      }
    }

    fetchYears();
  }, [selectedBrand, selectedModel]);

  const featuredProducts = products ? products.slice(0, 4) : [];

  return (
    <div className="space-y-16 pb-16 text-store-dark" dir="rtl">
      {/* قسم الهيرو المطور */}
      <section className="relative w-full bg-gradient-to-br from-store-dark via-zinc-900 to-store-primary py-20 px-6 overflow-hidden text-white shadow-xl">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="bg-store-accent/20 backdrop-blur-md text-store-accent text-xs font-extrabold px-4 py-1.5 rounded-full inline-block border border-store-accent/30">
            🇨🇳 جسرك المباشر لسوق ومصانع قطع الغيار الصينية
          </span>
          
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            ابحث عن قطع غيار سيارتك الصينية بدقة وثقة
          </h1>
          
          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto font-medium">
            وفرنا لك آلاف القطع الأصلية والتجارية لجميع الماركات الصينية بأسعار تنافسية وضمان المطابقة برقم الهيكل.
          </p>

          {/* مربع كبسولة البحث المزدوجة */}
          <div className="bg-white/10 backdrop-blur-lg p-2.5 sm:p-3.5 rounded-3xl shadow-2xl max-w-2xl mx-auto border border-white/20">
            
            {/* أزرار اختيار نوع البحث */}
            <div className="flex items-center justify-center gap-2 mb-3 bg-zinc-900/60 p-1 rounded-2xl max-w-xs mx-auto border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setSearchMode('oem');
                  setSearchQuery('');
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  searchMode === 'oem'
                    ? 'bg-store-primary text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                رقم القطعة (OEM)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchMode('vin');
                  setSearchQuery('');
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  searchMode === 'vin'
                    ? 'bg-store-primary text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                رقم الهيكل (VIN)
              </button>
            </div>

            {/* نموذج إدخال البحث */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    searchMode === 'oem'
                      ? 'أدخل رقم القطعة الفني (مثل: CH-1306010-TH1)...'
                      : 'أدخل رقم الهيكل المكون من 17 خانة (VIN)...'
                  }
                  maxLength={searchMode === 'vin' ? 17 : 50}
                  className="w-full bg-white text-zinc-800 placeholder-zinc-400 border border-zinc-200 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-store-primary"
                />
              </div>

              <button
                type="submit"
                className="bg-store-primary hover:bg-store-secondary text-white font-extrabold px-7 py-3.5 rounded-2xl text-xs sm:text-sm transition-all shadow-md active:scale-95 shrink-0 flex items-center justify-center gap-2"
              >
                <span>{searchMode === 'oem' ? 'بحث برقم القطعة' : 'فحص برقم الهيكل'}</span>
                <span>🔍</span>
              </button>
            </form>

            {/* ملاحظة توضيحية */}
            <p className="text-[11px] text-zinc-300 mt-2.5 font-medium">
              {searchMode === 'oem'
                ? '💡 ابحث باستخدام رقم المصنع الأصلي (OEM) المكتوب على القطعة أو الكرتون.'
                : '🛡️ نضمن لك مطابقة القطع 100% مع مواصفات سيارتك فور إدخال رقم الهيكل.'}
            </p>
          </div>
        </div>
      </section>

      {/* محدد السيارة الذكي */}
      <section className="homepage_section py-0 overflow-hidden" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-10">
          
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl sm:text-4xl font-black text-store-dark tracking-tight">
              ابحث بقطع غيار سيارتك الصينية
            </h2>
            <p className="text-xs sm:text-base text-zinc-500 font-medium">
              اختر ماركة سيارتك، الموديل، وسنة الصنع للوصول الفوري للقطع المتوافقة
            </p>
          </div>

          <div className="bg-store-light p-4 sm:p-6 rounded-3xl border border-zinc-200 shadow-xl max-w-4xl mx-auto backdrop-blur-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              
              {/* 1. قائمة الماركات من جدول categories لتظهر كاملة */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-store-dark mr-1">اختر الماركة</label>
                <select 
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setSelectedModel('');
                    setSelectedYear('');
                  }}
                  className="w-full bg-white text-zinc-800 text-sm font-bold px-4 py-3 rounded-2xl border border-zinc-200 focus:outline-none focus:border-store-secondary transition-all cursor-pointer"
                >
                  <option value="">اختر الشركة الصينية...</option>
                  {categories.map((cat) => (
                    <option key={cat.id || cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. قائمة الموديلات من جدول vehicles */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-store-dark mr-1">2. اختر نوع السيارة</label>
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand || loadingModels}
                  className="w-full bg-white text-zinc-800 text-sm font-bold px-4 py-3 rounded-2xl border border-zinc-200 focus:outline-none focus:border-store-secondary transition-all cursor-pointer disabled:opacity-50"
                >
                  <option value="">
                    {loadingModels ? "جاري التحميل..." : (!selectedBrand ? 'اختر الشركة أولاً...' : 'اختر نوع السيارة...')}
                  </option>
                  {availableModels.map((modelName) => (
                    <option key={modelName} value={modelName}>
                      {modelName}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. قائمة سنوات الصنع */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-store-dark mr-1">3. سنة الصنع</label>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  disabled={!selectedModel || loadingYears}
                  className="w-full bg-white text-zinc-800 text-sm font-bold px-4 py-3 rounded-2xl border border-zinc-200 focus:outline-none focus:border-store-secondary transition-all cursor-pointer disabled:opacity-50"
                >
                  <option value="">
                    {loadingYears ? "جاري التحميل..." : (!selectedModel ? "اختر الموديل أولاً" : "اختر سنة الصنع...")}
                  </option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <button 
              onClick={() => {
                const queryParams = new URLSearchParams();
                if (selectedBrand) queryParams.append('brand', selectedBrand);
                if (selectedModel) queryParams.append('model', selectedModel);
                if (selectedYear) queryParams.append('year', selectedYear);
                
                window.location.href = `/products?${queryParams.toString()}`;
              }}
              className="w-full bg-store-secondary hover:bg-store-primary text-white font-black py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <span>عرض قطع الغيار المتوافقة</span>
              <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      </section>

      {/* شريط الشركات المتحرك */}
      <section className="homepage_section py-4 overflow-hidden">
        {categories.length > 0 && (
          <div className="relative w-full flex overflow-x-hidden group py-4">
            <div className="absolute left-0 inset-y-0 w-24 sm:w-40 bg-gradient-to-r from-store-light via-store-light/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-24 sm:w-40 bg-gradient-to-l from-store-light via-store-light/80 to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee whitespace-nowrap gap-6 sm:gap-8 group-hover:[animation-play-state:paused]">
              {[...categories, ...categories, ...categories].map((cat, index) => (
                <Link
                  key={`${cat.id || cat.name}-${index}`}
                  href={`/products?category=${cat.slug || cat.name}`}
                  className="group/card flex flex-col items-center justify-center gap-4 p-3 transition-all duration-300 shrink-0 active:scale-95"
                >
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-store-light border border-zinc-200 flex items-center justify-center p-6 shadow-sm group-hover/card:border-store-secondary group-hover/card:scale-105 group-hover/card:shadow-xl transition-all duration-300">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-contain filter drop-shadow-sm" />
                    ) : (
                      <span className="text-store-primary font-black text-4xl">{cat.name.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-base sm:text-lg font-black text-store-dark text-center line-clamp-1">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      
{/* بنر الصور المتحركة التلقائي */}
<section className="w-full max-w-7xl mx-auto px-2 sm:px-4">
  <div className="relative w-full aspect-[3/1] overflow-hidden rounded-xl sm:rounded-2xl shadow-sm group">

    {banners.map((imgSrc, index) => (
      <Link
        key={index}
        href="/products"
        aria-label={`عرض منتجات المتجر - البنر ${index + 1}`}
        className={`absolute inset-0 block transition-opacity duration-1000 ease-in-out ${
          currentBannerIndex === index
            ? 'opacity-100 z-10'
            : 'opacity-0 z-0 pointer-events-none'
        }`}
      >
        <img
          src={imgSrc}
          alt={`بنر المتجر ${index + 1}`}
          className="w-full h-full object-contain"
        />
      </Link>
    ))}

    <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
      {banners.map((_, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => setCurrentBannerIndex(idx)}
          aria-label={`الانتقال للصورة ${idx + 1}`}
          className={`h-2 rounded-full transition-all ${
            currentBannerIndex === idx
              ? 'w-6 bg-white'
              : 'w-2 bg-white/60'
          }`}
        />
      ))}
    </div>

  </div>
</section>


      {/* قسم المنتجات المضافة حديثاً */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-store-dark">
              المنتجات المضافة حديثاً
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              تصفح أحدث ما تم إضافته للمتجر
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-bold text-store-secondary hover:text-store-primary flex items-center gap-1"
          >
            عرض الكل ←
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-store-light rounded-3xl border border-dashed border-zinc-200">
            <p className="text-zinc-400">لا توجد منتجات متوفرة حالياً.</p>
          </div>
        ) : (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 overflow-x-auto sm:overflow-visible gap-4 sm:gap-6 pb-4 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group w-[260px] sm:w-auto shrink-0 snap-start"
              >
                <div
                  onClick={() => {
                    setSelectedProduct({
                      id: product.id,
                      name: product.title,
                      price: product.price,
                      image: product.image || 'https://via.placeholder.com/300',
                      description: product.description,
                      category: product.category,
                    });
                    setIsDrawerOpen(true);
                  }}
                  className="p-4 cursor-pointer"
                >
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-store-light mb-4">
                    <img
                      src={product.image || 'https://via.placeholder.com/300'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.category && (
                      <span className="absolute top-3 right-3 bg-store-accent/90 backdrop-blur-md text-store-dark text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {product.category}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-store-dark text-base mb-1 line-clamp-1 group-hover:text-store-secondary transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-4">
                    {product.description}
                  </p>
                </div>

                <div className="p-4 bg-store-light border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-base font-black text-store-dark">
                    {product.price} ر.س
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="bg-store-primary hover:bg-store-secondary text-white px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1"
                  >
                    + السلة
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* بنر ترويجي */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-store-primary via-store-secondary to-store-dark rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-store-accent/20 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 text-center md:text-right relative z-10">
            <span className="bg-store-accent text-store-dark text-xs font-extrabold px-3.5 py-1.5 rounded-full inline-block">
              عرض لفترة محدودة 🔥
            </span>
            <h3 className="text-2xl sm:text-3xl font-black leading-tight">
              احصل على خصم 20% على طلبك القادم مباشرة!
            </h3>
            <p className="text-zinc-200 text-xs sm:text-sm max-w-xl">
              استخدم كود الخصم <span className="bg-white/20 px-2 py-0.5 rounded font-mono font-bold text-white">SAVE20</span> عند إتمام السداد واستمتع بتوفير إضافي.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-store-light text-store-dark hover:bg-white font-extrabold px-8 py-3.5 rounded-2xl shadow-lg transition-all active:scale-95 text-sm"
            >
              <span>تسوق العروض الآن</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 rotate-180">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <TestimonialsTicker />

      {/* مميزات المتجر */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-store-light rounded-3xl border border-zinc-200 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-white rounded-2xl mx-auto flex items-center justify-center text-store-secondary text-xl font-bold shadow-sm">
              🚚
            </div>
            <h3 className="font-bold text-store-dark">شحن سريع وآمن</h3>
            <p className="text-xs text-zinc-500">توصيل لجميع مناطق المملكة بأسرع وقت</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-white rounded-2xl mx-auto flex items-center justify-center text-store-primary text-xl font-bold shadow-sm">
              🔒
            </div>
            <h3 className="font-bold text-store-dark">دفع إلكتروني آمن</h3>
            <p className="text-xs text-zinc-500">طرق دفع متعددة ومحمية بالكامل</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-white rounded-2xl mx-auto flex items-center justify-center text-store-accent text-xl font-bold shadow-sm">
              ⭐
            </div>
            <h3 className="font-bold text-store-dark">ضمان الجودة</h3>
            <p className="text-xs text-zinc-500">منتجات أصلية ومضمونة 100%</p>
          </div>
        </div>
      </section>

      <ProductDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}