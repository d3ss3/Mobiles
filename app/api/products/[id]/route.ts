// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';

// البيانات التجريبية المؤقتة
const mockProducts = [
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = mockProducts.find((p) => p.id === params.id);

  if (!product) {
    return NextResponse.json(
      { success: false, message: 'المنتج غير موجود' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: product,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: `تم تحديث المنتج رقم ${params.id} بنجاح`,
      data: { id: params.id, ...body },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء التحديث' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    success: true,
    message: `تم حذف المنتج رقم ${params.id} بنجاح`,
  });
}
