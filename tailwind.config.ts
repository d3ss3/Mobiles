import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        store: {
          dark: '#38324E',      // اللون الكحلي/الرمادي الداكن الفاخر (للنصوص والترويسة والعناوين)
          primary: '#4A4466',   // اللون الرئيسي البارز للأزرار والعناصر الأساسية الهامة
          secondary: '#79A3AF', // اللون الثانوي السماوي الهادئ (للتحويم Hover، الأيقونات، والروابط)
          accent: '#9CC5A1',    // لون التمييز الأخضر الهادئ (لحالة توفر المخزون وشارات النجاح)
          light: '#F4F6EE',     // اللون الفاتح الكريمي/الرمادي الناعم (لخلفيات الصفحات والبطاقات)
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;