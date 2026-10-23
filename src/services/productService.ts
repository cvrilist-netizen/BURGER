import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialMenu';

const PRODUCTS_COLLECTION = 'products';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('sortOrder', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return INITIAL_PRODUCTS;
    }
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
  }
}

export function subscribeToProducts(
  onSuccess: (products: Product[]) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('sortOrder', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onSuccess(INITIAL_PRODUCTS);
        } else {
          const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
          onSuccess(items);
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
        } catch (err) {
          if (onError) onError(err as Error);
        }
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
  }
}

export async function seedProductsToFirestore(): Promise<number> {
  try {
    const batch = writeBatch(db);
    for (const prod of INITIAL_PRODUCTS) {
      const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      batch.set(docRef, prod);
    }
    await batch.commit();
    return INITIAL_PRODUCTS.length;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PRODUCTS_COLLECTION);
  }
}

export async function saveProduct(product: Product): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${product.id}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(docRef, product);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateProductField(id: string, updates: Partial<Product>): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function removeProduct(id: string): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
