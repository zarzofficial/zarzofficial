import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = window.ZARZ_FIREBASE_CONFIG || {
  apiKey: "AIzaSyBJ6g-W2bAQwBkkxA_gngN4TMGR_DlVcgM",
  authDomain: "zarzofficial-66638.firebaseapp.com",
  projectId: "zarzofficial-66638",
  databaseURL: "https://zarzofficial-66638-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "zarzofficial-66638.firebasestorage.app",
  messagingSenderId: "1041600161752",
  appId: "1:1041600161752:web:1130c415a1ad37cfdc74ad",
  measurementId: "G-MC300PCDPS"
};

function getFirebaseErrorCode(error) {
  return String(error?.code || "").toLowerCase();
}

function getFirebaseErrorText(error) {
  return String(error?.message || "").toLowerCase();
}

function getFriendlyOrderErrorMessage(error) {
  const code = getFirebaseErrorCode(error);
  const message = getFirebaseErrorText(error);

  if (code.includes("permission-denied") || message.includes("insufficient permissions")) {
    return "تعذر إرسال الطلب لأن صلاحيات قاعدة البيانات تمنع حفظه حاليًا.";
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

function enrichFirebaseError(error, fallbackMessage) {
  const nextError = error instanceof Error ? error : new Error(String(error || fallbackMessage));
  nextError.userMessage = nextError.userMessage || fallbackMessage;
  return nextError;
}

window.firebaseReadyPromise = (async () => {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log("Firebase ready");
    return db;
  } catch (error) {
    const userMessage = "تعذر تهيئة الاتصال بقاعدة البيانات. يرجى إعادة تحميل الصفحة ثم المحاولة مرة أخرى.";
    const nextError = enrichFirebaseError(error, userMessage);
    console.error("Firebase initialization failed", nextError);
    throw nextError;
  }
})();

window.createOrder = async function(orderData) {
  try {
    const db = await window.firebaseReadyPromise;
    const result = await addDoc(collection(db, "orders"), orderData);
    console.log("Order saved to Firestore");
    alert("تم إرسال الطلب ✅");
    return result;
  } catch (error) {
    const userMessage = getFriendlyOrderErrorMessage(error);
    const nextError = enrichFirebaseError(error, userMessage);
    console.error("Failed to save order to Firestore:", nextError);
    alert(`تعذر إرسال الطلب\n${userMessage}`);
    throw nextError;
  }
};
