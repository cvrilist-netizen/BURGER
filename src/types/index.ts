export type ProductCategory =
  | 'burger'
  | 'hotdog'
  | 'lavash'
  | 'kfc'
  | 'garnir'
  | 'sous'
  | 'ichimlik'
  | 'kofe'
  | 'choy'
  | 'kokteyl';

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  iconName: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // in UZS (integer)
  imageUrl: string;
  description: string;
  available: boolean;
  sortOrder: number;
  isPriceConfirmed: boolean; // if false, cannot be ordered (e.g. Qora kofe)
  badge?: string; // e.g. "Xit", "Achchiq", "Yangi"
}

export interface CartItem {
  product: Product;
  quantity: number;
  itemNotes?: string;
}

export type OrderStatus =
  | 'pending'    // Yangi tushgan
  | 'accepted'   // Qabul qilindi
  | 'preparing'  // Oshpaz tayyorlamoqda
  | 'ready'      // Buyurtma tayyor
  | 'completed'  // Yakunlandi
  | 'cancelled'; // Bekor qilindi

export type DeliveryType = 'pickup' | 'delivery';
export type PaymentMethod = 'cash' | 'card';

export interface OrderItemSummary {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  itemNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "CB-1042"
  customerName: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  items: OrderItemSummary[];
  itemsCount: number;
  subtotal: number;
  deliveryFee: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string; // ISO date string
  updatedAt: string;
  customerId?: string;
}

export type UserAppRole = 'customer' | 'cook' | 'admin';

export interface UserRoleRecord {
  userId: string;
  email: string;
  role: UserAppRole;
  updatedAt: string;
}

export interface RestaurantSettings {
  name: string;
  slogan: string;
  address: string;
  phone: string;
  workingHours: string;
  deliveryFee: number;
  minOrderAmount: number;
  isOrderingActive: boolean;
  enabledPaymentMethods: ('cash' | 'card')[];
  mapUrl: string;
}
