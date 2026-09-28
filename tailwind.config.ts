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
          dark: '#2C2C2C',      // للنصوص والعناصر الداكنة والترويسة
          primary: '#853953',   // اللون الأساسي للأزرار والعناصر البارزة
          secondary: '#612D53', // اللون الثانوي وتأثيرات المرور (Hover)
          light: '#F3F4F4',     // خلفيات الصفحات والعناصر الفاتحة
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