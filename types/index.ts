export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

// 2. تعريف عنصر السلة (Cart Item)
export interface CartItem {
  product: Product;
  quantity: number;
}
