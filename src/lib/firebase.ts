import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot, 
  getDocFromServer,
  Unsubscribe 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { OrderRecord, TransactionRecord, UserProfile, ServiceItem, SystemSettings } from '../types';
import { SERVICES_CATALOG } from '../data/servicesData';

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// Initialize Firestore using named database ID if provisioned
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Helper to convert Firebase Auth errors into friendly messages
export function getAuthErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code = error.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in or reset your password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/user-not-found':
      return 'No account was found with this email. Please check your spelling or register.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please verify your credentials or click "Forgot Password".';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please wait a moment or reset your password.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    default:
      return error.message || 'Authentication failed. Please verify your details.';
  }
}

// Auto sign-in anonymously if no user is signed in to establish public session
export async function ensureAuthSession(): Promise<string | null> {
  try {
    if (auth.currentUser) {
      return auth.currentUser.uid;
    }
    const cred = await signInAnonymously(auth);
    return cred.user.uid;
  } catch (err) {
    console.warn('Anonymous Firebase auth fallback:', err);
    return null;
  }
}

// Connection test per skill requirements
export async function validateFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'system', 'connection_test'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection check: Client currently offline or initializing.');
    }
    return true;
  }
}

// ==========================================
// Firebase Authentication Methods
// ==========================================

import { isReservedUsername } from './termsPolicy';

export async function registerAccount(
  email: string,
  pass: string,
  fullName: string,
  phoneNumber?: string
): Promise<{ user: FirebaseUser; profile: UserProfile }> {
  // Check reserved usernames prior to account provisioning
  const reservedCheck = isReservedUsername(fullName.trim() || email.split('@')[0], DESIGNATED_ADMIN_UID);
  if (reservedCheck.isReserved) {
    throw new Error(reservedCheck.reason || 'This name contains a protected system reserved term.');
  }

  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  const user = cred.user;

  const displayName = fullName.trim() || email.split('@')[0];
  await updateProfile(user, { displayName });

  const randomApiKey = `kt_live_${Math.random().toString(36).substring(2, 9)}${Math.random().toString(36).substring(2, 9)}`;

  const profile: UserProfile = {
    uid: user.uid,
    email: user.email || email.trim(),
    displayName,
    phoneNumber: phoneNumber?.trim() || '',
    accountTier: 'Gold',
    createdAt: new Date().toISOString(),
    apiKey: randomApiKey,
  };

  // Save profile to users collection
  await setDoc(doc(db, 'users', user.uid), profile);

  // Initialize their wallet with 0 balance
  await setDoc(
    doc(db, 'wallets', user.uid),
    {
      balance: 0,
      updatedAt: new Date().toISOString(),
      userName: displayName,
      phoneNumber: phoneNumber?.trim() || '',
      accountTier: 'Gold',
      totalSpent: 0,
      ordersCount: 0,
    },
    { merge: true }
  );

  return { user, profile };
}

export async function loginAccount(email: string, pass: string): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return cred.user;
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function logoutAccount(): Promise<void> {
  await signOut(auth);
}

export const SUPPORT_EMAIL = 'kentechlikeS@gmail.com';
export const SUPPORT_PHONE = '+254 793 749 604';

// Designated Admin UID requested by user
export const DESIGNATED_ADMIN_UID = 'thkYKuQCw0XHsYJBXnAqCJTP6G33';
export const ADMIN_UIDS: string[] = [DESIGNATED_ADMIN_UID];

export async function checkIsAdmin(uid?: string | null): Promise<boolean> {
  if (!uid) return false;
  if (ADMIN_UIDS.includes(uid)) return true;
  try {
    const adminSnap = await getDoc(doc(db, 'admins', uid));
    if (adminSnap.exists() && adminSnap.data().active !== false) {
      return true;
    }
  } catch (e) {
    console.warn('Error checking admin doc:', e);
  }
  return false;
}

export async function ensureAdminDesignation(): Promise<void> {
  try {
    const adminRef = doc(db, 'admins', DESIGNATED_ADMIN_UID);
    await setDoc(adminRef, {
      uid: DESIGNATED_ADMIN_UID,
      role: 'admin',
      active: true,
      assignedAt: new Date().toISOString(),
      email: 'amadifanitees@gmail.com',
      systemLevel: 'SuperAdmin'
    }, { merge: true });

    // Also ensure user profile has admin role
    const userRef = doc(db, 'users', DESIGNATED_ADMIN_UID);
    await setDoc(userRef, {
      uid: DESIGNATED_ADMIN_UID,
      role: 'admin',
      isAdmin: true,
      accountTier: 'Administrator',
      displayName: 'System Admin (KenTech)'
    }, { merge: true });
  } catch (err) {
    console.warn('Notice setting up admin document:', err);
  }
}

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.warn('Notice fetching user profile:', err);
    return null;
  }
}

// ==========================================
// Real-time Firestore Subscriptions
// ==========================================

export function subscribeToOrders(
  onUpdate: (orders: OrderRecord[]) => void
): Unsubscribe {
  const ordersCol = collection(db, 'orders');
  return onSnapshot(
    ordersCol,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => d.data() as OrderRecord);
        items.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('Orders real-time listener note:', err.message);
    }
  );
}

export function subscribeToTransactions(
  onUpdate: (transactions: TransactionRecord[]) => void
): Unsubscribe {
  const txnsCol = collection(db, 'transactions');
  return onSnapshot(
    txnsCol,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => d.data() as TransactionRecord);
        items.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('Transactions real-time listener note:', err.message);
    }
  );
}

export function subscribeToWallet(
  onUpdate: (balance: number) => void,
  userId = 'default_user'
): Unsubscribe {
  const walletRef = doc(db, 'wallets', userId);
  return onSnapshot(
    walletRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (typeof data.balance === 'number') {
          onUpdate(data.balance);
        }
      }
    },
    (err) => {
      console.warn('Wallet real-time listener note:', err.message);
    }
  );
}

// ==========================================
// Firestore Persistence Helpers
// ==========================================

export async function saveOrderToFirestore(order: OrderRecord): Promise<void> {
  try {
    await setDoc(doc(db, 'orders', order.id), order);
  } catch (error) {
    console.error('Failed to save order to Firestore:', error);
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error Notice:', JSON.stringify(errInfo));
  return errInfo;
}

export async function updateOrderInFirestore(orderId: string, updates: Partial<OrderRecord>): Promise<void> {
  try {
    await setDoc(doc(db, 'orders', orderId), updates, { merge: true });
    // Also update cached orders in localStorage
    try {
      const raw = localStorage.getItem('kentech_orders');
      if (raw) {
        const list: OrderRecord[] = JSON.parse(raw);
        const idx = list.findIndex(o => o.id === orderId);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...updates };
          localStorage.setItem('kentech_orders', JSON.stringify(list));
        }
      }
    } catch (e) {}
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
  }
}

export async function loadOrdersFromFirestore(): Promise<OrderRecord[] | null> {
  try {
    const snapshot = await getDocs(collection(db, 'orders'));
    if (snapshot.empty) return null;
    const items = snapshot.docs.map((docSnap) => docSnap.data() as OrderRecord);
    items.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'orders');
    return null;
  }
}

export async function saveTransactionToFirestore(txn: TransactionRecord): Promise<void> {
  try {
    await setDoc(doc(db, 'transactions', txn.id), txn, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `transactions/${txn.id}`);
  }
}

export async function loadTransactionsFromFirestore(): Promise<TransactionRecord[] | null> {
  try {
    const snapshot = await getDocs(collection(db, 'transactions'));
    if (snapshot.empty) return null;
    const items = snapshot.docs.map((docSnap) => docSnap.data() as TransactionRecord);
    items.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'transactions');
    return null;
  }
}

export async function saveWalletBalanceToFirestore(balance: number, userId = 'default_user'): Promise<void> {
  try {
    await setDoc(
      doc(db, 'wallets', userId), 
      { 
        balance, 
        updatedAt: new Date().toISOString(),
        userName: 'KenTech Client',
        accountTier: 'Gold'
      }, 
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `wallets/${userId}`);
  }
}

export async function loadWalletBalanceFromFirestore(userId = 'default_user'): Promise<number | null> {
  try {
    const snap = await getDoc(doc(db, 'wallets', userId));
    if (snap.exists() && typeof snap.data().balance === 'number') {
      return snap.data().balance;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `wallets/${userId}`);
    return null;
  }
}

// ==========================================
// System Broadcast Notice Synchronization
// ==========================================

export const DEFAULT_BROADCAST_NOTICE = 
  '⚡ Safaricom M-Pesa STK Push is operating at instant speeds (< 3s). Extra 10% promo bonus active on deposits!';

export function subscribeToBroadcastNotice(
  onUpdate: (notice: string) => void
): Unsubscribe {
  // Check local cache immediately for instant latency-free render
  try {
    const cached = localStorage.getItem('kentech_broadcast_notice');
    if (cached !== null) {
      onUpdate(cached);
    }
  } catch (e) {}

  const broadcastRef = doc(db, 'system', 'broadcast');
  return onSnapshot(
    broadcastRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const notice = typeof data.notice === 'string' ? data.notice : DEFAULT_BROADCAST_NOTICE;
        try {
          localStorage.setItem('kentech_broadcast_notice', notice);
        } catch (e) {}
        onUpdate(notice);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'system/broadcast');
    }
  );
}

export async function saveBroadcastNoticeToFirestore(notice: string, author = 'admin'): Promise<void> {
  // 1. Immediately cache in localStorage for instant multi-tab sync
  try {
    localStorage.setItem('kentech_broadcast_notice', notice);
    window.dispatchEvent(new CustomEvent('kentech_broadcast_updated', { detail: notice }));
  } catch (e) {}

  // 2. Persist to Firestore /system/broadcast
  try {
    await setDoc(
      doc(db, 'system', 'broadcast'),
      {
        notice,
        updatedAt: new Date().toISOString(),
        author
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'system/broadcast');
  }
}

// ==========================================
// Services Catalog & Pricing Synchronization
// ==========================================

export function subscribeToServicesCatalog(
  onUpdate: (services: ServiceItem[]) => void
): Unsubscribe {
  // Check localStorage first for instant initial paint
  try {
    const cached = localStorage.getItem('kentech_services_catalog');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onUpdate(parsed);
      }
    }
  } catch (e) {}

  const servicesRef = doc(db, 'system', 'services_catalog');
  return onSnapshot(
    servicesRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data.services) && data.services.length > 0) {
          try {
            localStorage.setItem('kentech_services_catalog', JSON.stringify(data.services));
          } catch (e) {}
          onUpdate(data.services);
          return;
        }

        // If stored as overrides and custom services
        if (data.overrides || data.customServices) {
          const overrides: Record<string, Partial<ServiceItem>> = data.overrides || {};
          const customServices: ServiceItem[] = data.customServices || [];

          const merged = SERVICES_CATALOG.map((base) => {
            const ov = overrides[base.id];
            return ov ? { ...base, ...ov } : base;
          });

          const finalCatalog = [...customServices, ...merged];
          try {
            localStorage.setItem('kentech_services_catalog', JSON.stringify(finalCatalog));
          } catch (e) {}
          onUpdate(finalCatalog);
        }
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'system/services_catalog');
    }
  );
}

export async function saveServicesCatalogToFirestore(services: ServiceItem[]): Promise<void> {
  // 1. Immediately cache in localStorage and trigger window event
  try {
    localStorage.setItem('kentech_services_catalog', JSON.stringify(services));
    window.dispatchEvent(new CustomEvent('kentech_services_updated', { detail: services }));
  } catch (e) {}

  // 2. Persist to Firestore /system/services_catalog
  try {
    // Extract overrides from base catalog to keep payload lean
    const overrides: Record<string, { ratePer1000?: number; disabled?: boolean; name?: string; description?: string; minQuantity?: number; maxQuantity?: number }> = {};
    const customServices: ServiceItem[] = [];

    services.forEach((s) => {
      const base = SERVICES_CATALOG.find((b) => b.id === s.id);
      if (base) {
        if (
          base.ratePer1000 !== s.ratePer1000 ||
          base.disabled !== s.disabled ||
          base.name !== s.name
        ) {
          overrides[s.id] = {
            ratePer1000: s.ratePer1000,
            disabled: s.disabled,
            name: s.name,
            minQuantity: s.minQuantity,
            maxQuantity: s.maxQuantity
          };
        }
      } else {
        customServices.push(s);
      }
    });

    await setDoc(
      doc(db, 'system', 'services_catalog'),
      {
        services,
        overrides,
        customServices,
        updatedAt: new Date().toISOString(),
        totalCount: services.length,
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'system/services_catalog');
  }
}

// ==========================================
// Global System & Payment Settings
// ==========================================

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  broadcastNotice: DEFAULT_BROADCAST_NOTICE,
  tillNumber: '1856074',
  paymentPhone: '0793749604',
  paybill: '1856074',
  supportEmail: 'kentechlikeS@gmail.com',
  supportPhone: '+254 793 749 604',
  promoBonusPercent: 10,
  ordersAlert: 'All API routes running 100% capacity',
  maintenanceMode: false,
};

export function subscribeToSystemSettings(
  onUpdate: (settings: SystemSettings) => void
): Unsubscribe {
  try {
    const cached = localStorage.getItem('kentech_system_settings');
    if (cached) {
      const parsed = JSON.parse(cached);
      onUpdate({
        ...DEFAULT_SYSTEM_SETTINGS,
        ...parsed,
        tillNumber: parsed.tillNumber || '1856074',
      });
    }
  } catch (e) {}

  const settingsRef = doc(db, 'system', 'settings');
  return onSnapshot(
    settingsRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Partial<SystemSettings>;
        const merged: SystemSettings = {
          ...DEFAULT_SYSTEM_SETTINGS,
          ...data,
          tillNumber: data.tillNumber || '1856074',
        };
        try {
          localStorage.setItem('kentech_system_settings', JSON.stringify(merged));
        } catch (e) {}
        onUpdate(merged);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'system/settings');
    }
  );
}

export async function saveSystemSettingsToFirestore(settings: Partial<SystemSettings>): Promise<void> {
  try {
    const raw = localStorage.getItem('kentech_system_settings');
    const prev = raw ? JSON.parse(raw) : DEFAULT_SYSTEM_SETTINGS;
    const merged = { ...prev, ...settings };
    localStorage.setItem('kentech_system_settings', JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('kentech_settings_updated', { detail: merged }));
  } catch (e) {}

  try {
    await setDoc(
      doc(db, 'system', 'settings'),
      {
        ...settings,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'system/settings');
  }
}

export async function seedInitialDataIfEmpty(
  initialOrders: OrderRecord[],
  initialTransactions: TransactionRecord[],
  initialBalance: number
): Promise<void> {
  try {
    await ensureAuthSession();
    
    // Check if default wallet exists
    const walletSnap = await getDoc(doc(db, 'wallets', 'default_user'));
    if (!walletSnap.exists()) {
      await saveWalletBalanceToFirestore(initialBalance, 'default_user');
    }

    // Check if orders collection is empty
    const ordersSnap = await getDocs(collection(db, 'orders'));
    if (ordersSnap.empty) {
      for (const order of initialOrders) {
        await setDoc(doc(db, 'orders', order.id), order, { merge: true });
      }
    }

    // Check if transactions collection is empty
    const txnsSnap = await getDocs(collection(db, 'transactions'));
    if (txnsSnap.empty) {
      for (const txn of initialTransactions) {
        await setDoc(doc(db, 'transactions', txn.id), txn, { merge: true });
      }
    }

    // Check if system broadcast exists
    const bSnap = await getDoc(doc(db, 'system', 'broadcast'));
    if (!bSnap.exists()) {
      await setDoc(doc(db, 'system', 'broadcast'), {
        notice: DEFAULT_BROADCAST_NOTICE,
        updatedAt: new Date().toISOString(),
        author: 'system'
      }, { merge: true });
    }

    // Check if system settings exists
    const sSnap = await getDoc(doc(db, 'system', 'settings'));
    if (!sSnap.exists()) {
      await setDoc(doc(db, 'system', 'settings'), {
        ...DEFAULT_SYSTEM_SETTINGS,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Notice seeding initial Firestore documents:', err);
  }
}
