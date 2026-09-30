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

  // تكرار التصنيفات للجوال لضمان حركة سلسة ومستمرة
  const marqueeItems = categories.length > 0 
    ? Array(6).fill(categories).flat() 
    : [];

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

      {/* 2. قسم الشركات / التصنيفات (شبكة متجاوبة Grid تعمل بامتياز على الجوال والكمبيوتر) */}
      <section className="homepage_section py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-8" dir="rtl">
          <div className="text-center mb-6 space-y-1">
            <h2 className="text-2xl font-black text-store-dark">تصفح حسب الشركة الصينية</h2>
            <p className="text-xs sm:text-sm text-zinc-500">اختر ماركة سيارتك لعرض القطع المتوافقة بدقة</p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-3xl border border-dashed border-zinc-200">
              <p className="text-zinc-400 text-sm">جاري تحميل التصنيفات أو لا توجد تصنيفات مضافة حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id || cat.name}
                  href={`/products?category=${cat.slug || cat.id}`}
                  className="bg-white p-3 sm:p-4 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md hover:border-store-primary transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-zinc-50 flex items-center justify-center p-2 group-hover:scale-105 transition-transform overflow-hidden">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-store-primary font-black text-xl">
                        {cat.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-store-dark text-center line-clamp-1 group-hover:text-store-primary">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
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