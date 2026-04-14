import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  getRedirectResult,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import type { OrderPayload, OrderRecord } from "./order-utils";

const DEFAULT_AUTH_DOMAIN = "zarzofficial-66638.firebaseapp.com";
const CUSTOM_AUTH_DOMAIN = "auth.zarzofficial.com";
const GOOGLE_REDIRECT_PENDING_KEY = "zarz_google_redirect_pending";
const USER_COLLECTION_NAME = "users";

function resolveAuthDomain() {
  if (typeof window === "undefined") return CUSTOM_AUTH_DOMAIN;

  const runtimeHost = String(window.location.hostname || "").trim().toLowerCase();
  if (runtimeHost.endsWith("firebaseapp.com") || runtimeHost.endsWith("web.app")) {
    return DEFAULT_AUTH_DOMAIN;
  }

  return CUSTOM_AUTH_DOMAIN;
}

const firebaseConfig = {
  apiKey: "AIzaSyBJ6g-W2bAQwBkkxA_gngN4TMGR_DlVcgM",
  authDomain: resolveAuthDomain(),
  projectId: "zarzofficial-66638",
  databaseURL: "https://zarzofficial-66638-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "zarzofficial-66638.firebasestorage.app",
  messagingSenderId: "1041600161752",
  appId: "1:1041600161752:web:1130c415a1ad37cfdc74ad",
  measurementId: "G-MC300PCDPS",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

let initialized = false;

function shouldPreferGoogleRedirect() {
  if (typeof window === "undefined") return false;
  const coarsePointer = typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
  const userAgent = String(window.navigator?.userAgent || "").toLowerCase();
  return coarsePointer || /android|iphone|ipad|ipod|mobile/.test(userAgent);
}

function getErrorCode(error: unknown) {
  return String((error as { code?: string })?.code || "").toLowerCase();
}

function getErrorText(error: unknown) {
  return String((error as { message?: string })?.message || "").toLowerCase();
}

function withUserMessage(error: unknown, message: string) {
  const nextError = error instanceof Error ? error : new Error(message);
  (nextError as Error & { userMessage?: string }).userMessage = message;
  return nextError as Error & { userMessage?: string };
}

function getFriendlyAuthError(error: unknown, action: "signin" | "register" | "google" | "reset") {
  const code = getErrorCode(error);
  const text = getErrorText(error);

  if (code.includes("invalid-email")) return "صيغة البريد الإلكتروني غير صحيحة.";
  if (code.includes("email-already-in-use")) return "هذا البريد الإلكتروني مستخدم بالفعل.";
  if (code.includes("weak-password")) return "كلمة المرور ضعيفة. استخدم 6 أحرف أو أكثر.";

  if (
    code.includes("wrong-password") ||
    code.includes("invalid-credential") ||
    code.includes("user-not-found")
  ) {
    return action === "reset"
      ? "لا يوجد حساب مرتبط بهذا البريد الإلكتروني."
      : "البريد الإلكتروني أو كلمة المرور غير صحيحين.";
  }

  if (code.includes("popup-blocked")) {
    return "المتصفح حظر نافذة Google. اسمح بالنوافذ المنبثقة ثم حاول مرة أخرى.";
  }

  if (code.includes("popup-closed-by-user")) {
    return "تم إغلاق نافذة Google قبل إكمال تسجيل الدخول.";
  }

  if (code.includes("unauthorized-domain") || code.includes("auth-domain-config-required")) {
    return "دومين الموقع غير مفعل داخل Firebase Authentication.";
  }

  if (text.includes("redirect_uri_mismatch")) {
    return "تم اكتشاف خطأ redirect_uri_mismatch في Google Sign-In. تم تحويل المصادقة إلى auth.zarzofficial.com، أعد المحاولة الآن.";
  }

  if (code.includes("too-many-requests")) {
    return "تم إيقاف المحاولات مؤقتًا. حاول مرة أخرى بعد قليل.";
  }

  if (text.includes("network")) {
    return "تعذر الاتصال بالشبكة. تحقق من الإنترنت ثم حاول مرة أخرى.";
  }

  if (action === "register") return "تعذر إنشاء الحساب الآن. حاول مرة أخرى بعد قليل.";
  if (action === "google") return "تعذر تسجيل الدخول عبر Google الآن.";
  if (action === "reset") return "تعذر إرسال رابط إعادة تعيين كلمة المرور الآن.";
  return "تعذر تسجيل الدخول الآن. حاول مرة أخرى بعد قليل.";
}

function getFriendlyOrderError(error: unknown) {
  const code = getErrorCode(error);
  const text = getErrorText(error);

  if (code.includes("permission-denied") || text.includes("insufficient permissions")) {
    return "تعذر حفظ الطلب لأن صلاحيات قاعدة البيانات تمنع ذلك حاليًا.";
  }
  if (code.includes("unauthenticated")) {
    return "تعذر حفظ الطلب لأن جلسة تسجيل الدخول غير صالحة حاليًا.";
  }
  if (code.includes("invalid-argument") || code.includes("failed-precondition")) {
    return "تعذر حفظ الطلب لأن بعض البيانات غير مكتملة أو غير مقبولة.";
  }
  if (text.includes("network")) {
    return "تعذر حفظ الطلب بسبب مشكلة اتصال مؤقتة.";
  }
  return "تعذر حفظ الطلب الآن. حاول مرة أخرى بعد قليل.";
}

async function initializeFirebase() {
  if (initialized) return;
  initialized = true;
  auth.languageCode = "ar";
  await setPersistence(auth, browserLocalPersistence);

  if (typeof window !== "undefined") {
    try {
      const redirectResult = await getRedirectResult(auth);
      window.sessionStorage.removeItem(GOOGLE_REDIRECT_PENDING_KEY);
      if (redirectResult?.user) {
        await syncUserRecord(redirectResult.user);
      }
    } catch (error) {
      window.sessionStorage.removeItem(GOOGLE_REDIRECT_PENDING_KEY);
      console.error("Google redirect result failed", error);
    }
  }
}

export const firebaseReadyPromise = initializeFirebase();

async function syncUserRecord(user: User | null) {
  if (!user?.uid) return;

  const userRef = doc(db, USER_COLLECTION_NAME, user.uid);
  const snapshot = await getDoc(userRef);
  const currentData = snapshot.exists() ? snapshot.data() : {};

  await setDoc(
    userRef,
    {
      uid: user.uid,
      name: user.displayName || currentData.name || "",
      email: user.email || currentData.email || "",
      phone: currentData.phone || "",
      photoURL: user.photoURL || currentData.photoURL || "",
      role: currentData.role || null,
      createdAt: currentData.createdAt || Timestamp.now(),
    },
    { merge: true },
  );
}

function mapOrderDoc(entry: { id: string; data: () => Record<string, unknown> }) {
  const data = entry.data() || {};
  const rawDate = data.date instanceof Timestamp ? data.date.toDate().toISOString() : String(data.date || "");

  return {
    id: entry.id,
    orderNumber: String(data.orderNumber || entry.id),
    total: String(data.total || ""),
    status: String(data.status || "pending"),
    date: rawDate,
    method: String(data.paymentMethodLabel || data.paymentMethod || ""),
    items: Array.isArray(data.items)
      ? data.items.map((item) => {
          const typedItem = item as Record<string, unknown>;
          return {
            title: String(typedItem.title || typedItem.productId || "خدمة"),
            qty: Number(typedItem.qty || typedItem.quantity || 1),
          };
        })
      : [],
    remote: true,
  } satisfies OrderRecord;
}

export function onAuthStateChanged(target: typeof auth, callback: (user: User | null) => void) {
  return firebaseOnAuthStateChanged(target, callback);
}

export async function registerWithEmail(input: { name?: string; email: string; password: string }) {
  try {
    await firebaseReadyPromise;
    const credential = await createUserWithEmailAndPassword(auth, input.email, input.password);
    if (input.name?.trim()) {
      await updateProfile(credential.user, { displayName: input.name.trim() });
    }
    await syncUserRecord(auth.currentUser);
    return credential.user;
  } catch (error) {
    throw withUserMessage(error, getFriendlyAuthError(error, "register"));
  }
}

export async function signInWithEmail(input: { email: string; password: string }) {
  try {
    await firebaseReadyPromise;
    const credential = await signInWithEmailAndPassword(auth, input.email, input.password);
    await syncUserRecord(credential.user);
    return credential.user;
  } catch (error) {
    throw withUserMessage(error, getFriendlyAuthError(error, "signin"));
  }
}

export async function signInWithGoogleFlow() {
  try {
    await firebaseReadyPromise;

    if (typeof window !== "undefined" && shouldPreferGoogleRedirect()) {
      window.sessionStorage.setItem(GOOGLE_REDIRECT_PENDING_KEY, "1");
      await signInWithRedirect(auth, googleProvider);
      return null;
    }

    const result = await signInWithPopup(auth, googleProvider);
    await syncUserRecord(result.user);
    return result.user;
  } catch (error) {
    throw withUserMessage(error, getFriendlyAuthError(error, "google"));
  }
}

export async function signOutUser() {
  await signOut(auth);
}

export async function sendPasswordReset(email: string) {
  try {
    await firebaseReadyPromise;
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw withUserMessage(error, getFriendlyAuthError(error, "reset"));
  }
}

export async function loadOrdersForCurrentUser() {
  const user = auth.currentUser;
  if (!user) return [] as OrderRecord[];

  try {
    const baseQuery = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("date", "desc"));
    const snapshot = await getDocs(baseQuery);
    return snapshot.docs.map((entry) => mapOrderDoc(entry));
  } catch (error) {
    const fallbackQuery = query(collection(db, "orders"), where("userId", "==", user.uid));
    const snapshot = await getDocs(fallbackQuery);
    return snapshot.docs
      .map((entry) => mapOrderDoc(entry))
      .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
  }
}

export async function deleteOrderForCurrentUser(orderId: string) {
  const user = auth.currentUser;
  if (!user) {
    throw withUserMessage(new Error("Not authenticated"), "يجب تسجيل الدخول أولًا لحذف الطلب.");
  }

  await deleteDoc(doc(db, "orders", orderId));
}

export async function createOrder(payload: OrderPayload) {
  const user = auth.currentUser;
  if (!user) {
    throw withUserMessage(new Error("Not authenticated"), "يجب تسجيل الدخول أولًا لحفظ الطلب داخل الحساب.");
  }

  try {
    await syncUserRecord(user);
    await addDoc(collection(db, "orders"), {
      ...payload,
      userId: user.uid,
      userEmail: user.email || "",
      date: Timestamp.now(),
    });
  } catch (error) {
    throw withUserMessage(error, getFriendlyOrderError(error));
  }
}

export {
  addDoc,
  collection,
  createUserWithEmailAndPassword,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  sendPasswordResetEmail,
  setDoc,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  Timestamp,
  updateProfile,
  where,
};
