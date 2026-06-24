export type ProductType = "software" | "app" | "device";
export type OrderStatus = "pending" | "paid" | "delivered";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  price: number;
  type: ProductType;
  inventory: number | null;
  features: string;
  createdAt: string;
  media?: ProductMedia[];
}

export interface ProductMedia {
  id: string;
  productId: string;
  url: string;
  type: string;
}

export interface TimelineEntry {
  id: string;
  year: number;
  title: string;
  description: string;
  tags: string;
  sortOrder: number;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  notes: string | null;
  createdAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  type: ProductType;
  quantity: number;
  imageUrl?: string;
}
