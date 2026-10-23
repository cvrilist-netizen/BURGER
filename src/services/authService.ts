import {
  signInWithPopup,
  signOut as fbSignOut,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../firebase/config';
import { UserAppRole, UserRoleRecord } from '../types';

const BOOTSTRAP_ADMIN_EMAIL = 'cvrilist@gmail.com';
const USER_ROLES_COLLECTION = 'userRoles';
const ADMINS_COLLECTION = 'admins';

export async function loginWithGoogle(): Promise<User> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const user = cred.user;

    // Check if user is the bootstrapped admin
    const isAdminEmail = user.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

    // Ensure role document exists in Firestore
    const roleRef = doc(db, USER_ROLES_COLLECTION, user.uid);
    const roleSnap = await getDoc(roleRef);

    if (!roleSnap.exists()) {
      const defaultRole: UserAppRole = isAdminEmail ? 'admin' : 'customer';
      const roleRecord: UserRoleRecord = {
        userId: user.uid,
        email: user.email || '',
        role: defaultRole,
        updatedAt: new Date().toISOString()
      };
      await setDoc(roleRef, roleRecord);

      if (isAdminEmail) {
        // Also register in admins collection for security rules
        await setDoc(doc(db, ADMINS_COLLECTION, user.uid), {
          userId: user.uid,
          email: user.email,
          createdAt: new Date().toISOString()
        });
      }
    } else if (isAdminEmail && roleSnap.data().role !== 'admin') {
      await setDoc(roleRef, { role: 'admin' }, { merge: true });
      await setDoc(doc(db, ADMINS_COLLECTION, user.uid), {
        userId: user.uid,
        email: user.email,
        createdAt: new Date().toISOString()
      });
    }

    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  await fbSignOut(auth);
}

export async function getUserRole(user: User | null): Promise<UserAppRole> {
  if (!user) return 'customer';

  if (user.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
    return 'admin';
  }

  const path = `${USER_ROLES_COLLECTION}/${user.uid}`;
  try {
    const roleRef = doc(db, USER_ROLES_COLLECTION, user.uid);
    const roleSnap = await getDoc(roleRef);
    if (roleSnap.exists()) {
      return (roleSnap.data() as UserRoleRecord).role || 'customer';
    }
    return 'customer';
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function assignUserRole(userId: string, email: string, role: UserAppRole): Promise<void> {
  const path = `${USER_ROLES_COLLECTION}/${userId}`;
  try {
    const roleRef = doc(db, USER_ROLES_COLLECTION, userId);
    await setDoc(roleRef, {
      userId,
      email,
      role,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    if (role === 'admin') {
      await setDoc(doc(db, ADMINS_COLLECTION, userId), {
        userId,
        email,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function onAuthListener(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
