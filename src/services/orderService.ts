import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  limit
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Order, OrderStatus, CartItem, DeliveryType, PaymentMethod, Product } from '../types';
import { fetchProducts } from './productService';
import { fetchRestaurantSettings } from './settingsService';

const ORDERS_COLLECTION = 'orders';

// Generates a short, clean, human-readable order number, e.g., "CB-4892"
export function generateOrderNumber(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CB-${randomSuffix}`;
}

export interface CreateOrderParams {
  customerName: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  customerId?: string;
}

export async function createOrder(params: CreateOrderParams): Promise<Order> {
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const path = `${ORDERS_COLLECTION}/${orderId}`;

  try {
    // 1. Fetch official products from Firestore to ensure price integrity
    const latestProducts = await fetchProducts();
    const productMap = new Map<string, Product>();
    latestProducts.forEach(p => productMap.set(p.id, p));

    // 2. Fetch current settings for delivery fee
    const settings = await fetchRestaurantSettings();

    // 3. Recalculate subtotal using verified database prices
    let calculatedSubtotal = 0;
    const validatedItems = params.items.map(cartItem => {
      const dbProduct = productMap.get(cartItem.product.id) || cartItem.product;

      // Ensure price is confirmed and product is available
      if (!dbProduct.isPriceConfirmed || !dbProduct.available) {
        throw new Error(`"${dbProduct.name}" hozirda buyurtma berish uchun mavjud emas.`);
      }

      const itemTotal = dbProduct.price * cartItem.quantity;
      calculatedSubtotal += itemTotal;

      return {
        productId: dbProduct.id,
        name: dbProduct.name,
        price: dbProduct.price,
        quantity: cartItem.quantity,
        itemNotes: cartItem.itemNotes || ''
      };
    });

    if (validatedItems.length === 0) {
      throw new Error('Savatcha bo‘sh. Iltimos mahsulot tanlang.');
    }

    const deliveryFee = params.deliveryType === 'delivery' ? settings.deliveryFee : 0;
    const totalPrice = calculatedSubtotal + deliveryFee;
    const orderNumber = generateOrderNumber();
    const nowIso = new Date().toISOString();

    const orderData: Order = {
      id: orderId,
      orderNumber,
      customerName: params.customerName.trim(),
      customerPhone: params.customerPhone.trim(),
      deliveryType: params.deliveryType,
      deliveryAddress: params.deliveryType === 'delivery' ? (params.deliveryAddress || '').trim() : '',
      notes: (params.notes || '').trim(),
      paymentMethod: params.paymentMethod,
      items: validatedItems,
      itemsCount: validatedItems.reduce((acc, curr) => acc + curr.quantity, 0),
      subtotal: calculatedSubtotal,
      deliveryFee,
      totalPrice,
      status: 'pending',
      createdAt: nowIso,
      updatedAt: nowIso,
      ...(params.customerId ? { customerId: params.customerId } : {})
    };

    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await setDoc(docRef, orderData);

    return orderData;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as Order;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function findOrderByNumber(orderNumber: string): Promise<Order | null> {
  const cleanNum = orderNumber.trim().toUpperCase();
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('orderNumber', '==', cleanNum),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      // Also try finding by document id
      const directDoc = await getOrderById(orderNumber.trim());
      return directDoc;
    }
    return snap.docs[0].data() as Order;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
  }
}

export function subscribeToOrder(
  orderId: string,
  onUpdate: (order: Order | null) => void,
  onError?: (err: Error) => void
): () => void {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    return onSnapshot(
      docRef,
      (snap) => {
        if (!snap.exists()) {
          onUpdate(null);
        } else {
          onUpdate(snap.data() as Order);
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, path);
        } catch (err) {
          if (onError) onError(err as Error);
        }
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'), limit(150));
    return onSnapshot(
      q,
      (snap) => {
        const orders = snap.docs.map(doc => doc.data() as Order);
        onUpdate(orders);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
        } catch (err) {
          if (onError) onError(err as Error);
        }
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
  }
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
