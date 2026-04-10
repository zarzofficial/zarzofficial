import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  getRedirectResult,
  onIdTokenChanged,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const FIRESTORE_SDK_URL = "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
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
let firestoreServicesPromise = null;
const USER_COLLECTION_NAME = "users";
const pendingUserRecordSyncs = new Map();
const queuedUserRecordSyncs = new Map();
let userRecordSyncListenerBound = false;
const GOOGLE_REDIRECT_PENDING_KEY = "zarz_google_redirect_pending";
const GOOGLE_REDIRECT_RESULT_KEY = "zarz_google_redirect_result";

function readSessionStorageValue(key) {
  try {
    return window.sessionStorage?.getItem(key) || "";
  } catch (error) {
    return "";
  }
}

function writeSessionStorageValue(key, value) {
  try {
    window.sessionStorage?.setItem(key, value);
  } catch (error) {
    // Ignore storage failures and continue with the in-memory auth flow.
  }
}

function removeSessionStorageValue(key) {
  try {
    window.sessionStorage?.removeItem(key);
  } catch (error) {
    // Ignore storage failures and continue with the in-memory auth flow.
  }
}

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

  return null;
}

function getOrderDateSortValue(value) {
  const parsedDate = getSafeDate(value);
  return parsedDate ? parsedDate.getTime() : 0;
}

function sanitizeProfileField(value, maxLength = 0) {
  const text = value == null ? "" : String(value).trim();
  return maxLength > 0 ? text.slice(0, maxLength) : text;
}

function resolveUserCreatedAt(user) {
  const rawCreationTime = String(user?.metadata?.creationTime || "").trim();
  const parsedDate = rawCreationTime ? new Date(rawCreationTime) : new Date();
  return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
}

function normalizeStoredTimestamp(value) {
  if (value && typeof value.toDate === "function") {
    return value.toDate().getTime();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.getTime();
    }
  }

  return null;
}

function buildUserRecordPayload(user, existingData, firestore) {
  return {
    uid: sanitizeProfileField(user?.uid, 128),
    name: sanitizeProfileField(user?.displayName || existingData?.name, 100),
    email: sanitizeProfileField(user?.email || existingData?.email, 200),
    phone: sanitizeProfileField(user?.phoneNumber || existingData?.phone, 40),
    photoURL: sanitizeProfileField(user?.photoURL || existingData?.photoURL, 500),
    createdAt: existingData?.createdAt || firestore.Timestamp.fromDate(resolveUserCreatedAt(user)),
    role: existingData?.role ? sanitizeProfileField(existingData.role, 40) : null
  };
}

function shouldWriteUserRecord(existingData, payload) {
  if (!existingData) return true;

  return (
    String(existingData.uid || "") !== String(payload.uid || "") ||
    String(existingData.name || "") !== String(payload.name || "") ||
    String(existingData.email || "") !== String(payload.email || "") ||
    String(existingData.phone || "") !== String(payload.phone || "") ||
    String(existingData.photoURL || "") !== String(payload.photoURL || "") ||
    String(existingData.role || "") !== String(payload.role || "") ||
    normalizeStoredTimestamp(existingData.createdAt) !== normalizeStoredTimestamp(payload.createdAt)
  );
}

function isRetryableUserSyncError(error) {
  const code = getFirebaseErrorCode(error);
  const message = getFirebaseErrorText(error);

  return (
    code.includes("permission-denied") ||
    code.includes("unauthenticated") ||
    code.includes("not-authenticated") ||
    code.includes("failed-precondition") ||
    code.includes("unavailable") ||
    code.includes("deadline-exceeded") ||
    code.includes("aborted") ||
    message.includes("not confirmed on the server") ||
    message.includes("missing or insufficient permissions")
  );
}

async function writeUserRecordToFirestore(user) {
  if (!user?.uid) return null;

  const { app, auth } = await window.firebaseReadyPromise;
  const firestore = await getFirestoreServices(app);
  const userRef = firestore.doc(firestore.db, USER_COLLECTION_NAME, String(user.uid));
  const activeUser = auth.currentUser?.uid === user.uid ? auth.currentUser : user;
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      if (typeof activeUser?.getIdToken === "function") {
        await activeUser.getIdToken(attempt > 1);
      }

      const snapshot = await firestore.getDocFromServer(userRef);
      const existingData = snapshot.exists() ? snapshot.data() || {} : null;
      const payload = buildUserRecordPayload(user, existingData, firestore);

      if (!shouldWriteUserRecord(existingData, payload)) {
        return existingData || payload;
      }

      await firestore.setDoc(userRef, payload, { merge: true });
      const confirmedSnapshot = await firestore.getDocFromServer(userRef);
      if (!confirmedSnapshot.exists()) {
        throw new Error("User record was not confirmed on the server.");
      }

      return confirmedSnapshot.data() || payload;
    } catch (error) {
      if (attempt >= maxAttempts || !isRetryableUserSyncError(error)) {
        throw error;
      }

      await new Promise((resolve) => window.setTimeout(resolve, attempt * 250));
    }
  }

  return null;
}

function bindUserRecordSyncListener(auth) {
  if (userRecordSyncListenerBound || typeof onIdTokenChanged !== "function") {
    return;
  }

  userRecordSyncListenerBound = true;
  onIdTokenChanged(auth, (user) => {
    if (user) {
      queueUserRecordSync(user);
    }
  });
}

async function waitForAuthUserReady(auth, expectedUid) {
  const timeoutMs = 6000;
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const activeUser = auth.currentUser;
    if (activeUser?.uid === expectedUid) {
      if (typeof activeUser.getIdToken === "function") {
        await activeUser.getIdToken();
      }

      await new Promise((resolve) => window.setTimeout(resolve, 250));
      return activeUser;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 150));
  }

  return auth.currentUser?.uid === expectedUid ? auth.currentUser : null;
}

function queueUserRecordSync(user) {
  if (!user?.uid) return Promise.resolve(null);

  const userId = String(user.uid);
  queuedUserRecordSyncs.set(userId, user);

  const existingSync = pendingUserRecordSyncs.get(userId);
  if (existingSync) {
    return existingSync;
  }

  const syncPromise = (async () => {
    let result = null;

    while (queuedUserRecordSyncs.has(userId)) {
      const nextUser = queuedUserRecordSyncs.get(userId);
      queuedUserRecordSyncs.delete(userId);
      result = await writeUserRecordToFirestore(nextUser);
    }

    return result;
  })()
    .catch((error) => {
      if (isRetryableUserSyncError(error)) {
        queuedUserRecordSyncs.set(userId, user);
        window.setTimeout(() => {
          if (!pendingUserRecordSyncs.has(userId) && queuedUserRecordSyncs.has(userId)) {
            queueUserRecordSync(queuedUserRecordSyncs.get(userId));
          }
        }, 500);
        return null;
      }

      console.error("Failed to sync user record to Firestore:", error);
      return null;
    })
    .finally(() => {
      pendingUserRecordSyncs.delete(userId);

      if (queuedUserRecordSyncs.has(userId)) {
        queueUserRecordSync(queuedUserRecordSyncs.get(userId));
      }
    });

  pendingUserRecordSyncs.set(userId, syncPromise);
  return syncPromise;
}

function mapOrderSnapshot(snapshot) {
  const data = snapshot.data() || {};
  const orderDate = getSafeDate(data.date);
  const mappedItems = Array.isArray(data.items)
    ? data.items.map((item) => ({
        title: String(item?.title || item?.productTitle || item?.productId || "خدمة"),
        qty: Number(item?.quantity || item?.qty || 1)
      }))
    : [];

  return {
    id: snapshot.id,
    orderNumber: data.orderNumber || snapshot.id,
    date: orderDate ? orderDate.toISOString() : "",
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

function shouldPreferGoogleRedirect() {
  const userAgent = String(window.navigator?.userAgent || "").toLowerCase();
  const hasCoarsePointer = typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
  return hasCoarsePointer || /android|iphone|ipad|ipod|iemobile|opera mini|mobile/.test(userAgent);
}

function storeGoogleRedirectOutcome(outcome) {
  if (!outcome || typeof outcome !== "object") return;
  writeSessionStorageValue(
    GOOGLE_REDIRECT_RESULT_KEY,
    JSON.stringify({
      ...outcome,
      createdAt: Date.now()
    })
  );
}

async function resolvePendingGoogleRedirect(auth) {
  const hadPendingRedirect = readSessionStorageValue(GOOGLE_REDIRECT_PENDING_KEY) === "1";

  try {
    const redirectResult = await getRedirectResult(auth);
    removeSessionStorageValue(GOOGLE_REDIRECT_PENDING_KEY);

    if (redirectResult?.user) {
      storeGoogleRedirectOutcome({ status: "success" });
      return dispatchAuthChange(auth.currentUser || redirectResult.user);
    }

    if (hadPendingRedirect && auth.currentUser) {
      storeGoogleRedirectOutcome({ status: "success" });
      return dispatchAuthChange(auth.currentUser);
    }

    if (hadPendingRedirect) {
      storeGoogleRedirectOutcome({
        status: "cancelled",
        message: "لم يكتمل تسجيل الدخول عبر Google. حاول مرة أخرى."
      });
    }

    return null;
  } catch (error) {
    removeSessionStorageValue(GOOGLE_REDIRECT_PENDING_KEY);
    storeGoogleRedirectOutcome({
      status: "error",
      message: getFriendlyAuthErrorMessage(error, "google")
    });
    return null;
  }
}

async function getFirestoreServices(app) {
  if (firebaseServices?.firestore) {
    return firebaseServices.firestore;
  }

  if (!firestoreServicesPromise) {
    firestoreServicesPromise = import(FIRESTORE_SDK_URL)
      .then((firestoreModule) => {
        const db = firebaseServices?.db || firestoreModule.getFirestore(app);
        const firestore = {
          db,
          addDoc: firestoreModule.addDoc,
          collection: firestoreModule.collection,
          deleteDoc: firestoreModule.deleteDoc,
          doc: firestoreModule.doc,
          getDoc: firestoreModule.getDoc,
          getDocFromServer: firestoreModule.getDocFromServer,
          getDocs: firestoreModule.getDocs,
          orderBy: firestoreModule.orderBy,
          query: firestoreModule.query,
          setDoc: firestoreModule.setDoc,
          Timestamp: firestoreModule.Timestamp,
          where: firestoreModule.where
        };

        firebaseServices = {
          ...(firebaseServices || {}),
          db,
          firestore
        };

        return firestore;
      })
      .catch((error) => {
        firestoreServicesPromise = null;
        throw error;
      });
  }

  return firestoreServicesPromise;
}

window.firebaseReadyPromise = (async () => {
  try {
    const resolvedFirebaseConfig = await resolveFirebaseConfig();
    const app = initializeApp(resolvedFirebaseConfig);
    const auth = getAuth(app);
    auth.languageCode = "ar";
    await setPersistence(auth, browserLocalPersistence);
    bindUserRecordSyncListener(auth);
    await resolvePendingGoogleRedirect(auth);
    firebaseServices = { app, auth, db: null, firestore: null };
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

    const resolvedUser = auth.currentUser || credential.user;
    await waitForAuthUserReady(auth, resolvedUser.uid);
    await queueUserRecordSync(resolvedUser);
    return dispatchAuthChange(resolvedUser);
  } catch (error) {
    throw enrichFirebaseError(error, getFriendlyAuthErrorMessage(error, "register"));
  }
}

async function signInWithEmail({ email, password }) {
  try {
    const { auth } = await window.firebaseReadyPromise;
    const credential = await signInWithEmailAndPassword(auth, String(email || "").trim(), password);
    const resolvedUser = auth.currentUser || credential.user;
    await waitForAuthUserReady(auth, resolvedUser.uid);
    queueUserRecordSync(resolvedUser);
    return dispatchAuthChange(resolvedUser);
  } catch (error) {
    throw enrichFirebaseError(error, getFriendlyAuthErrorMessage(error, "signin"));
  }
}

async function signInWithGoogle() {
  try {
    const { auth } = await window.firebaseReadyPromise;

    const provider = createGoogleProvider();
    if (shouldPreferGoogleRedirect()) {
      writeSessionStorageValue(GOOGLE_REDIRECT_PENDING_KEY, "1");
      await signInWithRedirect(auth, provider);
      return { pendingRedirect: true };
    }

    const credential = await signInWithPopup(auth, provider);
    const resolvedUser = auth.currentUser || credential.user;
    await waitForAuthUserReady(auth, resolvedUser.uid);
    queueUserRecordSync(resolvedUser);
    return dispatchAuthChange(resolvedUser);
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
    const { auth, app } = await window.firebaseReadyPromise;
    const user = ensureAuthenticatedUser(auth);
    const { db, collection, getDocs, orderBy, query, where } = await getFirestoreServices(app);
    const ordersRef = collection(db, "orders");
    const fallbackQuery = query(ordersRef, where("userId", "==", user.uid));
    let snapshot;

    try {
      snapshot = await getDocs(query(ordersRef, where("userId", "==", user.uid), orderBy("date", "desc")));
    } catch (error) {
      if (!getFirebaseErrorCode(error).includes("failed-precondition")) {
        throw error;
      }

      snapshot = await getDocs(fallbackQuery);
    }

    return snapshot.docs
      .map(mapOrderSnapshot)
      .sort((a, b) => getOrderDateSortValue(b.date) - getOrderDateSortValue(a.date));
  } catch (error) {
    throw enrichFirebaseError(error, "تعذر تحميل الطلبات المرتبطة بهذا الحساب الآن.");
  }
}

async function deleteOrderForCurrentUser(orderId) {
  try {
    const { auth, app } = await window.firebaseReadyPromise;
    ensureAuthenticatedUser(auth);
    const { db, deleteDoc, doc } = await getFirestoreServices(app);
    await deleteDoc(doc(db, "orders", orderId));
    return true;
  } catch (error) {
    throw enrichFirebaseError(error, "تعذر حذف الطلب الآن. حاول مرة أخرى بعد قليل.");
  }
}

window.createOrder = async function(orderData) {
  try {
    const { auth, app } = await window.firebaseReadyPromise;
    const user = ensureAuthenticatedUser(auth);
    const { db, addDoc, collection } = await getFirestoreServices(app);
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
