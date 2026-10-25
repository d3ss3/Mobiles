export interface Product {
  id: string | number;
  title: string;
  description?: string;
  price: number;
  category: string;
  stock?: number;
  image?: string;
  oem_number?: string; // أضف هذا السطر
  created_at?: string;
}

// 2. تعريف عنصر السلة (Cart Item)
export interface CartItem {
  product: Product;
  quantity: number;
}
