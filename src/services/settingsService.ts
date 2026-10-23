import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { RestaurantSettings } from '../types';
import { INITIAL_SETTINGS } from '../data/initialMenu';

const SETTINGS_COLLECTION = 'settings';
const MAIN_SETTINGS_ID = 'restaurant';

export async function fetchRestaurantSettings(): Promise<RestaurantSettings> {
  const path = `${SETTINGS_COLLECTION}/${MAIN_SETTINGS_ID}`;
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, MAIN_SETTINGS_ID);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return INITIAL_SETTINGS;
    }
    return snap.data() as RestaurantSettings;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribeToRestaurantSettings(
  onSuccess: (settings: RestaurantSettings) => void,
  onError?: (error: Error) => void
): () => void {
  const path = `${SETTINGS_COLLECTION}/${MAIN_SETTINGS_ID}`;
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, MAIN_SETTINGS_ID);
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          onSuccess(snap.data() as RestaurantSettings);
        } else {
          onSuccess(INITIAL_SETTINGS);
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

export async function updateRestaurantSettings(updates: Partial<RestaurantSettings>): Promise<void> {
  const path = `${SETTINGS_COLLECTION}/${MAIN_SETTINGS_ID}`;
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, MAIN_SETTINGS_ID);
    const snap = await getDoc(docRef);
    const merged = snap.exists() ? { ...snap.data(), ...updates } : { ...INITIAL_SETTINGS, ...updates };
    await setDoc(docRef, merged);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
