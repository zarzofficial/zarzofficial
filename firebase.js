import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const DEFAULT_AUTH_DOMAIN = "zarzofficial-66638.firebaseapp.com";
const CUSTOM_AUTH_DOMAINS = ["zarzofficial.com", "auth.zarzofficial.com"];
const DEFAULT_AUTH_DOMAIN_RETRY_AFTER_MS = 60 * 1000;
const firebaseConfig = window.ZARZ_FIREBASE_CONFIG || {
  apiKey: "AIzaSyBJ6g-W2bAQwBkkxA_gngN4TMGR_DlVcgM",
  authDomain: DEFAULT_AUTH_DOMAIN,
  projectId: "zarzofficial-66638",
  databaseURL: "https://zarzofficial-66638-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "zarzofficial-66638.firebasestorage.app",
  messagingSenderId: "1041600161752",
  appId: "1:1041600161752:web:1130c415a1ad37cfdc74ad",
  measurementId: "G-MC300PCDPS"
};

window.zarzCurrentUser = null;
let firebaseServices = null;

function getAuthDomainProbeCacheKey(domain) {
  return `zarz_auth_domain_probe_${String(domain || "").trim().toLowerCase()}`;
}

function readCachedAuthDomainProbe(domain) {
  try {
    const rawValue = window.sessionStorage?.getItem(getAuthDomainProbeCacheKey(domain)) || "";
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue);
    if (!parsedValue || typeof parsedValue !== "object") {
      return null;
    }

    return parsedValue;
  } catch (error) {
    return null;
  }
}

function writeCachedAuthDomainProbe(domain, value) {
  try {
    window.sessionStorage?.setItem(
      getAuthDomainProbeCacheKey(domain),
      JSON.stringify({
        value,
        checkedAt: Date.now()
      })
    );
  } catch (error) {
    // Ignore storage failures and continue with runtime probing.
  }
}

async function canUseCustomAuthDomain(domain) {
  if (!domain || domain === DEFAULT_AUTH_DOMAIN || typeof window.fetch !== "function") {
    return false;
  }

  if (window.location.hostname === domain) {
    writeCachedAuthDomainProbe(domain, domain);
    return true;
  }

  const cachedProbe = readCachedAuthDomainProbe(domain);
  if (cachedProbe?.value === domain) {
    return true;
  }

  if (
    cachedProbe?.value === "default" &&
    Number.isFinite(cachedProbe.checkedAt) &&
    Date.now() - cachedProbe.checkedAt < DEFAULT_AUTH_DOMAIN_RETRY_AFTER_MS
  ) {
    return false;
  }

  if (navigator.onLine === false) {
    writeCachedAuthDomainProbe(domain, "default");
    return false;
  }

  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timeoutId = window.setTimeout(() => controller?.abort(), 1500);

  try {
    await window.fetch(`https://${domain}/__/auth/handler`, {
      method: "GET",
      mode: "no-cors",
      cache: "no-store",
      credentials: "omit",
      redirect: "follow",
      signal: controller?.signal
    });
    writeCachedAuthDomainProbe(domain, domain);
    return true;
  } catch (error) {
    writeCachedAuthDomainProbe(domain, "default");
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function resolveFirebaseConfig() {
  const resolvedConfig = { ...firebaseConfig };
  const customDomainOverride = String(window.ZARZ_FIREBASE_CONFIG?.authDomain || "").trim();

  if (customDomainOverride) {
    return resolvedConfig;
  }

  for (const domain of CUSTOM_AUTH_DOMAINS) {
    if (await canUseCustomAuthDomain(domain)) {
      resolvedConfig.authDomain = domain;
      break;
    }
  }

  return resolvedConfig;
}

function getFirebaseErrorCode(error) {
  return String(error?.code || "").toLowerCase();
}

function getFirebaseErrorText(error) {
  return String(error?.message || "").toLowerCase();
}

function getFriendlyOrderErrorMessage(error) {
  const code = getFirebaseErrorCode(error);
  const message = getFirebaseErrorText(error);

  if (code.includes("not-authenticated") || code.includes("permission-denied") || message.includes("insufficient permissions")) {
    return "تعذر إرسال الطلب لأن الحساب غير مسجل أو لأن صلاحيات قاعدة البيانات تمنع حفظه حاليًا.";
  }

  if (code.includes("unauthenticated")) {
    return "تعذر إرسال الطلب لأن جلسة التحقق غير صالحة. يرجى إعادة تحميل الصفحة ثم المحاولة مرة أخرى.";
  }

  if (code.includes("invalid-argument") || code.includes("failed-precondition")) {
    return "تعذر إرسال الطلب لأن بعض البيانات غير مكتملة أو غير مقبولة.";
  }

  if (code.includes("unavailable") || code.includes("deadline-exceeded") || code.includes("aborted") || message.includes("network")) {
    return "تعذر إرسال الطلب بسبب مشكلة اتصال مؤقتة مع قاعدة البيانات. يرجى المحاولة مرة أخرى.";
  }

  if (code.includes("resource-exhausted")) {
    return "تعذر إرسال الطلب حاليًا لأن الخدمة وصلت إلى حد الاستخدام المؤقت.";
  }

  return "تعذر إرسال الطلب بسبب خطأ غير متوقع أثناء حفظ البيانات.";
}

function getFriendlyAuthErrorMessage(error, action = "signin") {
  const code = getFirebaseErrorCode(error);
  const message = getFirebaseErrorText(error);

  if (code.includes("invalid-email")) {
    return "صيغة البريد الإلكتروني غير صحيحة.";
  }

  if (code.includes("user-disabled")) {
    return "تم إيقاف هذا الحساب. تواصل مع الدعم إذا كنت بحاجة للمساعدة.";
  }

  if (code.includes("email-already-in-use")) {
    return "هذا البريد الإلكتروني مستخدم بالفعل. جرّب تسجيل الدخول بدلًا من إنشاء حساب جديد.";
  }

  if (code.includes("weak-password")) {
    return "كلمة المرور ضعيفة. استخدم 6 أحرف أو أكثر.";
  }

  if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential")) {
    if (action === "reset") {
      return "لا يوجد حساب مرتبط بهذا البريد الإلكتروني.";
    }
    return "البريد الإلكتروني أو كلمة المرور غير صحيحين.";
  }

  if (code.includes("popup-blocked")) {
    return "المتصفح حظر نافذة Google. اسمح بالنوافذ المنبثقة ثم حاول مرة أخرى.";
  }

  if (code.includes("popup-closed-by-user")) {
    return "تم إغلاق نافذة Google قبل إكمال تسجيل الدخول.";
  }

  if (code.includes("account-exists-with-different-credential")) {
    return "هذا البريد مرتبط بطريقة دخول مختلفة. استخدم الطريقة الأصلية لهذا الحساب.";
  }

  if (code.includes("unauthorized-domain") || code.includes("auth-domain-config-required")) {
    return "دومين الموقع غير مضاف في Authorized domains داخل Firebase Authentication.";
  }

  if (code.includes("operation-not-allowed")) {
    return "طريقة تسجيل الدخول هذه غير مفعلة في Firebase Console حتى الآن.";
  }

  if (code.includes("too-many-requests")) {
    return "تم إيقاف المحاولات مؤقتًا بسبب كثرة الطلبات. حاول مرة أخرى بعد قليل.";
  }

  if (code.includes("not-ready")) {
    return "انتظر لحظة حتى يكتمل تحميل Firebase ثم حاول المتابعة عبر Google مرة أخرى.";
  }

  if (message.includes("network")) {
    return "تعذر الاتصال بالشبكة. تحقق من الإنترنت ثم حاول مرة أخرى.";
  }

  if (action === "register") {
    return "تعذر إنشاء الحساب الآن. حاول مرة أخرى بعد قليل.";
  }

  if (action === "google") {
    return "تعذر تسجيل الدخول عبر Google الآن. حاول مرة أخرى بعد قليل.";
  }

  if (action === "reset") {
    return "تعذر إرسال رسالة إعادة تعيين كلمة المرور الآن.";
  }

  return "تعذر تسجيل الدخول الآن. حاول مرة أخرى بعد قليل.";
}

function enrichFirebaseError(error, fallbackMessage) {
  const nextError = error instanceof Error ? error : new Error(String(error || fallbackMessage));
  nextError.userMessage = nextError.userMessage || fallbackMessage;
  return nextError;
}

function toPublicUser(user) {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
    emailVerified: Boolean(user.emailVerified),
    providerIds: Array.isArray(user.providerData) ? user.providerData.map((entry) => entry?.providerId).filter(Boolean) : []
  };
}

function getSafeDate(value) {
  if (value && typeof value.toDate === "function") {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date();
}

function mapOrderSnapshot(snapshot) {
  const data = snapshot.data() || {};
  const mappedItems = Array.isArray(data.items)
    ? data.items.map((item) => ({
        title: String(item?.title || item?.productTitle || item?.productId || "خدمة"),
        qty: Number(item?.quantity || item?.qty || 1)
      }))
    : [];

  return {
    id: snapshot.id,
    orderNumber: data.orderNumber || snapshot.id,
    date: getSafeDate(data.date).toISOString(),
    method: data.paymentMethodLabel || data.paymentMethod || "-",
    mode: data.paymentMethod || "",
    paymentReference: data.paymentReference || "-",
    status: "قيد المعالجة",
    total: data.total || "",
    items: mappedItems,
    remote: true
  };
}

function ensureAuthenticatedUser(auth) {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  const error = new Error("No authenticated user is available.");
  error.code = "auth/not-authenticated";
  throw enrichFirebaseError(error, "يرجى تسجيل الدخول أولًا للوصول إلى هذه الميزة.");
}

function dispatchAuthChange(user) {
  const publicUser = toPublicUser(user);
  window.zarzCurrentUser = publicUser;
  window.dispatchEvent(
    new CustomEvent("zarz-auth-changed", {
      detail: { user: publicUser }
    })
  );
  return publicUser;
}

function createGoogleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

window.firebaseReadyPromise = (async () => {
  try {
    const resolvedFirebaseConfig = await resolveFirebaseConfig();
    const app = initializeApp(resolvedFirebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    auth.languageCode = "ar";
    await setPersistence(auth, browserLocalPersistence);
    firebaseServices = { app, db, auth };
    console.log("Firebase ready");
    return firebaseServices;
  } catch (error) {
    const userMessage = "تعذر تهيئة الاتصال بخدمات Firebase. يرجى إعادة تحميل الصفحة ثم المحاولة مرة أخرى.";
    const nextError = enrichFirebaseError(error, userMessage);
    console.error("Firebase initialization failed", nextError);
    throw nextError;
  }
})();

window.zarzAuthStateReadyPromise = new Promise((resolve) => {
  window.firebaseReadyPromise
    .then(({ auth }) => {
      let resolved = false;
      onAuthStateChanged(auth, (user) => {
        const publicUser = dispatchAuthChange(user);
        if (!resolved) {
          resolved = true;
          resolve(publicUser);
        }
      });
    })
    .catch(() => resolve(null));
});

async function registerWithEmail({ name = "", email, password }) {
  try {
    const { auth } = await window.firebaseReadyPromise;
    const credential = await createUserWithEmailAndPassword(auth, String(email || "").trim(), password);

    if (name.trim()) {
      await updateProfile(credential.user, { displayName: name.trim() });
    }

    return dispatchAuthChange(auth.currentUser || credential.user);
  } catch (error) {
    throw enrichFirebaseError(error, getFriendlyAuthErrorMessage(error, "register"));
  }
}

async function signInWithEmail({ email, password }) {
  try {
    const { auth } = await window.firebaseReadyPromise;
    const credential = await signInWithEmailAndPassword(auth, String(email || "").trim(), password);
    return dispatchAuthChange(auth.currentUser || credential.user);
  } catch (error) {
    throw enrichFirebaseError(error, getFriendlyAuthErrorMessage(error, "signin"));
  }
}

async function signInWithGoogle() {
  try {
    const auth = firebaseServices?.auth;

    if (!auth) {
      const notReadyError = new Error("Firebase auth is still initializing.");
      notReadyError.code = "auth/not-ready";
      throw notReadyError;
    }

    const provider = createGoogleProvider();
    const credential = await signInWithPopup(auth, provider);
    return dispatchAuthChange(auth.currentUser || credential.user);
  } catch (error) {
    throw enrichFirebaseError(error, getFriendlyAuthErrorMessage(error, "google"));
  }
}

async function signOutUser() {
  try {
    const { auth } = await window.firebaseReadyPromise;
    await firebaseSignOut(auth);
    return dispatchAuthChange(null);
  } catch (error) {
    throw enrichFirebaseError(error, "تعذر تسجيل الخروج الآن. حاول مرة أخرى بعد قليل.");
  }
}

async function sendPasswordReset(email) {
  try {
    const { auth } = await window.firebaseReadyPromise;
    await sendPasswordResetEmail(auth, String(email || "").trim());
    return true;
  } catch (error) {
    throw enrichFirebaseError(error, getFriendlyAuthErrorMessage(error, "reset"));
  }
}

async function loadOrdersForCurrentUser() {
  try {
    const { auth, db } = await window.firebaseReadyPromise;
    const user = ensureAuthenticatedUser(auth);
    const ordersRef = collection(db, "orders");
    const snapshot = await getDocs(query(ordersRef, where("userId", "==", user.uid)));
    return snapshot.docs
      .map(mapOrderSnapshot)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    throw enrichFirebaseError(error, "تعذر تحميل الطلبات المرتبطة بهذا الحساب الآن.");
  }
}

async function deleteOrderForCurrentUser(orderId) {
  try {
    const { auth, db } = await window.firebaseReadyPromise;
    ensureAuthenticatedUser(auth);
    await deleteDoc(doc(db, "orders", orderId));
    return true;
  } catch (error) {
    throw enrichFirebaseError(error, "تعذر حذف الطلب الآن. حاول مرة أخرى بعد قليل.");
  }
}

window.createOrder = async function(orderData) {
  try {
    const { auth, db } = await window.firebaseReadyPromise;
    const user = ensureAuthenticatedUser(auth);
    const payload = {
      ...orderData,
      userId: user.uid,
      userEmail: user.email || ""
    };
    const result = await addDoc(collection(db, "orders"), payload);
    console.log("Order saved to Firestore");
    return { id: result.id };
  } catch (error) {
    const userMessage = getFriendlyOrderErrorMessage(error);
    const nextError = enrichFirebaseError(error, userMessage);
    console.error("Failed to save order to Firestore:", nextError);
    throw nextError;
  }
};

window.zarzAuth = {
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut: signOutUser,
  sendPasswordReset,
  loadOrdersForCurrentUser,
  deleteOrder: deleteOrderForCurrentUser,
  getCurrentUser() {
    return window.zarzCurrentUser;
  }
};
