'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/db';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import ProductDrawer from '@/components/products/ProductDrawer';
import TestimonialsTicker from '@/components/TestimonialsTicker';

export default function HomePage() {
  const { products } = useProducts();
  const { addToCart } = useCart();

  // حالة تخزين التصنيفات المسترجعة من قاعدة البيانات
  const [categories, setCategories] = useState<any[]>([]);

  // حالات السلايدر الجانبي للمنتجات
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // حالة البنر المتحرك
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // حالات محدد السيارة الذكي (Vehicle Selector)
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // خريطة الموديلات للشركات الصينية الكبرى
  const carModelsMap: Record<string, string[]> = {
    'changan': ['CS35 Plus', 'CS75 Plus', 'Alsvin', 'Eado', 'Uni-T', 'Uni-K', 'Uni-V'],
    'geely': ['Coolray', 'Monjaro', 'Tugella', 'Emgrand', 'Azkara'],
    'chery': ['Tiggo 4 Pro', 'Tiggo 7 Pro', 'Tiggo 8 Pro', 'Arrizo 6 Pro'],
    'haval': ['H6', 'Jolion', 'H9', 'Dargo'],
    'mg': ['MG 5', 'MG 6', 'MG RX5', 'MG ZS', 'MG Whale'],
    'jetour': ['X70', 'X70 Plus', 'X90 Plus', 'Dashing'],
    'tank': ['Tank 300', 'Tank 500'],
  };

  // مصفوفة روابط الصور للبنر المتحرك
  const banners = [
    "/images/banner1.png",
    "/images/banner2.png",
    "/images/banner3.jpg",
  ];

  // جلب التصنيفات وتشغيل مؤقت البنر تلقائياً عند تحميل الصفحة
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

    // مؤقت لتبديل الصور تلقائياً كل 4 ثوانٍ
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // عرض أحدث 4 منتجات في الصفحة الرئيسية
  const featuredProducts = products ? products.slice(0, 4) : [];

  return (
    <div className="space-y-16 pb-16 text-store-dark" dir="rtl">
      {/* قسم الهيرو المخصص لقطع الغيار */}
      <section className="relative w-full bg-gradient-to-br from-store-dark via-zinc-900 to-store-primary py-20 px-6 overflow-hidden text-white shadow-xl">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="bg-white/10 backdrop-blur-md text-store-light text-xs font-extrabold px-4 py-1.5 rounded-full inline-block border border-white/10">
            🇨🇳 جسرك المباشر لسوق ومصانع قطع الغيار الصينية
          </span>
          
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            ابحث عن قطع غيار سيارتك الصينية بدقة وثقة
          </h1>
          
          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto">
            وفرنا لك آلاف القطع الأصلية والتجارية لجميع الماركات الصينية بأسعار تنافسية وضمان المطابقة برقم الهيكل.
          </p>

          {/* صندوق البحث السريع (مطابق للمواقع العالمية) */}
          <div className="bg-white p-3 rounded-2xl shadow-2xl max-w-2xl mx-auto text-zinc-800 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="أدخل رقم الهيكل (VIN) أو رقم القطعة (OEM)..." 
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-xs sm:text-sm focus:outline-none focus:border-store-primary"
              />
            </div>
            <button className="bg-store-primary hover:bg-[#a0636a] text-white font-extrabold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 shrink-0">
              بحث بالهيكل 🔍
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-zinc-400 pt-2">
            <span>✨ ضمان مطابقة 100%</span>
            <span>•</span>
            <span>📦 شحن مباشر من الصين</span>
            <span>•</span>
            <span>🛠️ دعم فني متخصص</span>
          </div>
        </div>
      </section>

      {/* شريط البحث المطور (محدد السيارة الذكي) */}
      <section className="homepage_section py-0 overflow-hidden bg-gradient-to-b from-transparent via-zinc-50/50 to-transparent" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-10">
          
          {/* هيدر القسم */}
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl sm:text-4xl font-black text-store-dark tracking-tight">
              ابحث بقطع غيار سيارتك الصينية
            </h2>
            <p className="text-xs sm:text-base text-zinc-500 font-medium">
              اختر ماركة سيارتك، الموديل، وسنة الصنع للوصول الفوري للقطع المتوافقة
            </p>
          </div>

          {/* شريط محدد السيارة الذكي (Vehicle Selector Bar) */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/50 max-w-4xl mx-auto backdrop-blur-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              
              {/* 1. قائمة اختيار الماركة / الشركة */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 mr-1">1. اختر الماركة</label>
                <select 
                  value={selectedBrand}
                  onChange={(e) => {
                    const brandSlug = e.target.value.toLowerCase();
                    setSelectedBrand(e.target.value);
                    setSelectedModel('');
                    setAvailableModels(carModelsMap[brandSlug] || ['موديلات عامة']);
                  }}
                  className="w-full bg-zinc-50 text-zinc-800 text-sm font-bold px-4 py-3 rounded-2xl border border-zinc-200 focus:outline-none focus:border-store-primary focus:ring-2 focus:ring-store-primary/20 transition-all cursor-pointer"
                >
                  <option value="">اختر الشركة الصينية...</option>
                  {categories.map((cat) => (
                    <option key={cat.id || cat.name} value={cat.slug || cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. قائمة اختيار الموديل (تتعلّق وتتفعّل فور اختيار الماركة) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 mr-1">2. اختر نوع السيارة</label>
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand}
                  className="w-full bg-zinc-50 text-zinc-800 text-sm font-bold px-4 py-3 rounded-2xl border border-zinc-200 focus:outline-none focus:border-store-primary focus:ring-2 focus:ring-store-primary/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{!selectedBrand ? 'اختر الشركة أولاً...' : 'اختر نوع السيارة...'}</option>
                  {availableModels.map((modelName) => (
                    <option key={modelName} value={modelName}>
                      {modelName}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. قائمة اختيار سنة الصنع */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 mr-1">3. سنة الصنع</label>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-zinc-50 text-zinc-800 text-sm font-bold px-4 py-3 rounded-2xl border border-zinc-200 focus:outline-none focus:border-store-primary focus:ring-2 focus:ring-store-primary/20 transition-all cursor-pointer"
                >
                  <option value="">جميع السنوات</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021 وما قبلها</option>
                </select>
              </div>

            </div>

            {/* زر البحث والانتقال لصفحة القطع */}
            <button 
              onClick={() => {
                const queryParams = new URLSearchParams();
                if (selectedBrand) queryParams.append('brand', selectedBrand);
                if (selectedModel) queryParams.append('model', selectedModel);
                if (selectedYear) queryParams.append('year', selectedYear);
                
                window.location.href = `/products?${queryParams.toString()}`;
              }}
              className="w-full bg-store-primary text-white font-black py-3.5 rounded-2xl shadow-lg shadow-store-primary/30 hover:bg-store-primary/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <span>عرض قطع الغيار المتوافقة</span>
              <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      </section>

      {/* 2. قسم الشركات / شريط متحرك فاخر ببطاقات كبيرة وبارزة */}
      <section className="homepage_section py-4 overflow-hidden bg-gradient-to-b from-transparent via-zinc-50/50 to-transparent">
        {categories.length === 0 ? (
          <div className="max-w-7xl mx-auto px-4 text-center py-8 bg-white rounded-3xl border border-dashed border-zinc-200">
            <p className="text-zinc-400 text-sm">جاري تحميل التصنيفات أو لا توجد تصنيفات مضافة حالياً.</p>
          </div>
        ) : (
          <div className="relative w-full flex overflow-x-hidden group py-4">
            <div className="absolute left-0 inset-y-0 w-24 sm:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-24 sm:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee whitespace-nowrap gap-6 sm:gap-8 group-hover:[animation-play-state:paused]">
              {[...categories, ...categories, ...categories].map((cat, index) => (
                <Link
                  key={`${cat.id || cat.name}-${index}`}
                  href={`/products?category=${cat.slug || cat.id}`}
                  className="group/card flex flex-col items-center justify-center gap-4 p-3 transition-all duration-300 shrink-0 active:scale-95"
                >
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-white border border-zinc-200/80 flex items-center justify-center p-6 shadow-sm group-hover/card:border-store-primary group-hover/card:scale-105 group-hover/card:shadow-xl group-hover/card:shadow-store-primary/15 transition-all duration-300">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-contain filter drop-shadow-sm group-hover/card:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-store-primary font-black text-4xl group-hover/card:scale-110 transition-transform duration-300">
                        {cat.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  
                  <span className="text-base sm:text-lg font-black text-zinc-800 text-center line-clamp-1 group-hover/card:text-store-primary transition-colors duration-300">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 🌟 بنر الصور المتحركة التلقائي */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <Link 
          href="/products" 
          className="block relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group h-44 sm:h-64 lg:h-80"
        >
          {banners.map((imgSrc, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentBannerIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={imgSrc}
                alt={`بنر المتجر ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentBannerIndex(idx);
                }}
                className={`h-2 rounded-full transition-all ${
                  currentBannerIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/50'
                }`}
                aria-label={`الانتقال للصورة ${idx + 1}`}
              />
            ))}
          </div>
        </Link>
      </section>

      {/* 3. قسم المنتجات المضافة حديثاً */}
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
            className="text-sm font-bold text-store-primary hover:text-store-secondary flex items-center gap-1"
          >
            عرض الكل ←
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-zinc-200">
            <p className="text-zinc-400">لا توجد منتجات متوفرة حالياً.</p>
          </div>
        ) : (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 overflow-x-auto sm:overflow-visible gap-4 sm:gap-6 pb-4 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group w-[260px] sm:w-auto shrink-0 snap-start"
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
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-zinc-100 mb-4">
                    <img
                      src={product.image || 'https://via.placeholder.com/300'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.category && (
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-store-dark text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {product.category}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-store-dark text-base mb-1 line-clamp-1 group-hover:text-store-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-4">
                    {product.description}
                  </p>
                </div>

                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-base font-black text-store-dark">
                    {product.price} ر.س
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="bg-store-primary hover:bg-[#a0636a] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-1"
                  >
                    + السلة
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🌟 بنر إعلاني / ترويجي بين الأقسام */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-store-primary to-zinc-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 text-center md:text-right relative z-10">
            <span className="bg-white/20 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full inline-block">
              عرض لفترة محدودة 🔥
            </span>
            <h3 className="text-2xl sm:text-3xl font-black leading-tight">
              احصل على خصم 20% على طلبك القادم!
            </h3>
            <p className="text-zinc-200 text-xs sm:text-sm max-w-xl">
              استخدم كود الخصم <span className="bg-white/20 px-2 py-0.5 rounded font-mono font-bold text-white">SAVE20</span> عند إتمام السداد واستمتع بتوفير إضافي.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-store-dark hover:bg-zinc-100 font-extrabold px-8 py-3.5 rounded-2xl shadow-lg transition-all active:scale-95 text-sm"
            >
              <span>تسوق العروض الآن</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 rotate-180">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 🌟 قسم آراء العملاء */}
      <TestimonialsTicker />

      {/* 5. قسم مميزات المتجر */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-store-light rounded-2xl mx-auto flex items-center justify-center text-store-primary text-xl font-bold">
              🚚
            </div>
            <h3 className="font-bold text-store-dark">شحن سريع وآمن</h3>
            <p className="text-xs text-zinc-500">توصيل لجميع مناطق المملكة بأسرع وقت</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-store-light rounded-2xl mx-auto flex items-center justify-center text-store-primary text-xl font-bold">
              🔒
            </div>
            <h3 className="font-bold text-store-dark">دفع إلكتروني آمن</h3>
            <p className="text-xs text-zinc-500">طرق دفع متعددة ومحمية بالكامل</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-store-light rounded-2xl mx-auto flex items-center justify-center text-store-primary text-xl font-bold">
              ⭐
            </div>
            <h3 className="font-bold text-store-dark">ضمان الجودة</h3>
            <p className="text-xs text-zinc-500">منتجات أصلية ومضمونة 100%</p>
          </div>
        </div>
      </section>

      {/* استدعاء السلايدر الجانبي في الصفحة الرئيسية */}
      <ProductDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}