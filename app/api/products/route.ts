import { NextResponse } from 'next/server';
import { Product } from '@/types';

// بيانات وهمية تجريبية للمنتجات (سيتم ربطها بقاعدة البيانات لاحقاً)
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'سماعات لاسلكية عازلة للضوضاء',
    description:
      'سماعات عالية الجودة مع خاصية إلغاء الضوضاء وبطارية تدوم 30 ساعة.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'إلكترونيات',
    stock: 10,
  },
  {
    id: '2',
    title: 'ساعة ذكية رياضية',
    description: 'تتبع اللياقة البدنية ومعدل ضربات القلب مع مقاومة للماء.',
    price: 220,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'إلكترونيات',
    stock: 15,
  },
  {
    id: '3',
    title: 'حقيبة ظهر للمحمول',
    description: 'حقيبة مريحة وعصرية مع منفذ شحن USB ومساحة واسعة.',
    price: 130,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'إكسسوارات',
    stock: 8,
  },
];

// دالة GET لجلب المنتجات
export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockProducts,
  });
}
