/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false, // إيقاف swcMinify لمنع الخطأ في StackBlitz
  images: {
    unoptimized: true, // للسماح بتحميل الصور الخارجية بدون قيود
  },
};

module.exports = nextConfig;
