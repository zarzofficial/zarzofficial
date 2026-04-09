const DEFAULT_ALLOWED_ORIGIN_HOSTS = ["zarzofficial.com", "www.zarzofficial.com", "127.0.0.1", "localhost"];
const DEFAULT_PROJECT_ID = "zarzofficial-66638";
const DEFAULT_CONTINUE_URL = "https://zarzofficial.com/account/";
const DEFAULT_LINK_DOMAIN = "zarzofficial.com";
const DEFAULT_BRAND_NAME = "زارز الرسمي";
const DEFAULT_EMAIL_FROM = "زارز الرسمي <team@zarzofficial.com>";
const DEFAULT_EMAIL_REPLY_TO = "team@zarzofficial.com";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const FIREBASE_OOB_URL = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode";
const RESEND_EMAILS_URL = "https://api.resend.com/emails";
const GOOGLE_OAUTH_SCOPE = "https://www.googleapis.com/auth/identitytoolkit";

let googleAccessTokenCache = {
  cacheKey: "",
  token: "",
  expiresAt: 0
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/auth/email-action") {
      return handleAuthEmailAction(request, env);
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return jsonResponse({ ok: false, code: "not-found" }, 404);
  }
};

async function handleAuthEmailAction(request, env) {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, code: "method-not-allowed" }, 405, {
      Allow: "POST"
    });
  }

  if (!isAllowedOrigin(request, env)) {
    return jsonResponse({
      ok: false,
      code: "auth/forbidden-origin",
      userMessage: "تعذر تنفيذ الطلب من هذا المصدر."
    }, 403);
  }

  if (!hasRequiredEmailConfig(env)) {
    return jsonResponse({
      ok: false,
      code: "auth/custom-email-unavailable",
      userMessage: "خدمة البريد المخصص غير مهيأة بعد."
    }, 503);
  }

  let body = null;
  try {
    body = await request.json();
  } catch (error) {
    return jsonResponse({
      ok: false,
      code: "auth/invalid-request",
      userMessage: "تعذر قراءة بيانات الطلب."
    }, 400);
  }

  const type = normalizeActionType(body?.type);
  const email = normalizeEmail(body?.email);
  const displayName = normalizeDisplayName(body?.displayName);

  if (!type || !email) {
    return jsonResponse({
      ok: false,
      code: "auth/invalid-request",
      userMessage: "بيانات البريد غير مكتملة."
    }, 400);
  }

  try {
    const actionLink = await generateFirebaseActionLink({
      env,
      type,
      email,
      request
    });

    await sendTransactionalEmail({
      env,
      type,
      email,
      displayName,
      actionLink
    });

    return jsonResponse({
      ok: true,
      delivery: "custom"
    });
  } catch (error) {
    console.error("auth email action failed", {
      code: error?.code || "auth/custom-email-failed",
      message: error?.message || "Unknown error"
    });

    return jsonResponse({
      ok: false,
      code: error?.code || "auth/custom-email-failed",
      userMessage: error?.userMessage || "تعذر إرسال البريد الآن. حاول مرة أخرى بعد قليل."
    }, Number.isInteger(error?.status) ? error.status : 500);
  }
}

function hasRequiredEmailConfig(env) {
  return Boolean(
    getRequiredEnv(env, "RESEND_API_KEY") &&
    getRequiredEnv(env, "FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL") &&
    getRequiredEnv(env, "FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY")
  );
}

function isAllowedOrigin(request, env) {
  const origin = String(request.headers.get("Origin") || "").trim();
  if (!origin) {
    return true;
  }

  try {
    const hostname = new URL(origin).hostname.toLowerCase();
    return getAllowedOriginHosts(env).has(hostname);
  } catch (error) {
    return false;
  }
}

function getAllowedOriginHosts(env) {
  const configuredHosts = String(env.ALLOWED_APP_ORIGINS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return new Set([...DEFAULT_ALLOWED_ORIGIN_HOSTS, ...configuredHosts]);
}

function normalizeActionType(value) {
  const normalizedValue = String(value || "").trim().toLowerCase();
  if (normalizedValue === "verify_email" || normalizedValue === "password_reset") {
    return normalizedValue;
  }
  return "";
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeDisplayName(value) {
  return String(value || "").trim();
}

async function generateFirebaseActionLink({ env, type, email, request }) {
  const accessToken = await getGoogleAccessToken(env);
  const requestBody = {
    requestType: type === "verify_email" ? "VERIFY_EMAIL" : "PASSWORD_RESET",
    email,
    continueUrl: String(env.AUTH_EMAIL_ACTION_URL || DEFAULT_CONTINUE_URL),
    canHandleCodeInApp: false,
    returnOobLink: true,
    targetProjectId: String(env.FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID),
    linkDomain: String(env.FIREBASE_AUTH_LINK_DOMAIN || DEFAULT_LINK_DOMAIN)
  };

  if (type === "password_reset") {
    requestBody.userIp = String(
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("X-Forwarded-For") ||
      "127.0.0.1"
    ).split(",")[0].trim();
  }

  const response = await fetch(FIREBASE_OOB_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  const responseBody = await parseJsonResponse(response);

  if (!response.ok) {
    throw mapFirebaseActionError(response.status, responseBody, type);
  }

  const actionLink = String(responseBody?.oobLink || "").trim();
  if (!actionLink) {
    throw createWorkerError(
      "auth/missing-action-link",
      "تعذر إنشاء رابط البريد المطلوب.",
      502
    );
  }

  return actionLink;
}

function mapFirebaseActionError(status, responseBody, type) {
  const upstreamCode = String(
    responseBody?.error?.message ||
    responseBody?.message ||
    ""
  ).trim().toUpperCase();

  if (upstreamCode === "EMAIL_NOT_FOUND") {
    return createWorkerError(
      "auth/user-not-found",
      type === "password_reset"
        ? "لا يوجد حساب مرتبط بهذا البريد الإلكتروني."
        : "تعذر العثور على الحساب المطلوب.",
      404
    );
  }

  if (upstreamCode === "INVALID_EMAIL") {
    return createWorkerError(
      "auth/invalid-email",
      "صيغة البريد الإلكتروني غير صحيحة.",
      400
    );
  }

  if (upstreamCode === "OPERATION_NOT_ALLOWED") {
    return createWorkerError(
      "auth/operation-not-allowed",
      "طريقة التحقق هذه غير مفعلة في المشروع.",
      403
    );
  }

  return createWorkerError(
    "auth/firebase-oob-failed",
    "تعذر إنشاء رابط البريد الآن. حاول مرة أخرى بعد قليل.",
    status >= 400 ? status : 502
  );
}

async function sendTransactionalEmail({ env, type, email, displayName, actionLink }) {
  const emailPayload = buildEmailPayload({
    env,
    type,
    email,
    displayName,
    actionLink
  });

  const response = await fetch(RESEND_EMAILS_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getRequiredEnv(env, "RESEND_API_KEY")}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `auth-${type}-${hashForIdempotency(email)}-${Date.now()}`
    },
    body: JSON.stringify(emailPayload)
  });

  const responseBody = await parseJsonResponse(response);
  if (!response.ok) {
    throw createWorkerError(
      "auth/email-delivery-failed",
      "تم إنشاء الرابط لكن تعذر إرسال البريد من المزود الحالي.",
      response.status >= 400 ? response.status : 502
    );
  }

  if (!responseBody?.id) {
    throw createWorkerError(
      "auth/email-delivery-failed",
      "تم إنشاء الرابط لكن تعذر تأكيد إرسال البريد.",
      502
    );
  }
}

function buildEmailPayload({ env, type, email, displayName, actionLink }) {
  const brandName = String(env.AUTH_EMAIL_BRAND_NAME || DEFAULT_BRAND_NAME);
  const from = String(env.AUTH_EMAIL_FROM || DEFAULT_EMAIL_FROM);
  const replyTo = String(env.AUTH_EMAIL_REPLY_TO || DEFAULT_EMAIL_REPLY_TO);
  const safeName = escapeHtml(displayName || email);
  const safeBrandName = escapeHtml(brandName);
  const safeEmail = escapeHtml(email);
  const safeLink = escapeHtml(actionLink);
  const isVerification = type === "verify_email";
  const subject = isVerification
    ? `تأكيد بريدك الإلكتروني في ${brandName}`
    : `إعادة تعيين كلمة المرور في ${brandName}`;
  const intro = isVerification
    ? "أكمل تفعيل حسابك عبر الضغط على الزر التالي:"
    : "تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. اضغط على الزر التالي لإكمال العملية:";
  const buttonLabel = isVerification ? "تأكيد البريد الإلكتروني" : "إعادة تعيين كلمة المرور";
  const hint = isVerification
    ? "إذا لم تنشئ هذا الحساب، يمكنك تجاهل هذه الرسالة."
    : "إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة وسيبقى حسابك آمناً.";

  return {
    from,
    to: [email],
    subject,
    reply_to: replyTo,
    html: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <body style="margin:0;background:#08080d;font-family:Tahoma,Arial,sans-serif;color:#f7f7fb;">
    <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
      <div style="background:linear-gradient(180deg,#141421 0%,#0d0d14 100%);border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:32px;">
        <div style="font-size:14px;color:#8fdcff;margin-bottom:14px;">${safeBrandName}</div>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.4;color:#ffffff;">${escapeHtml(subject)}</h1>
        <p style="margin:0 0 14px;font-size:16px;line-height:1.9;color:#d7d7e3;">مرحباً ${safeName}،</p>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.9;color:#d7d7e3;">${escapeHtml(intro)}</p>
        <a href="${safeLink}" style="display:inline-block;background:linear-gradient(90deg,#ff1d8e 0%,#2ad3ff 100%);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;border-radius:999px;padding:16px 28px;">${escapeHtml(buttonLabel)}</a>
        <p style="margin:24px 0 0;font-size:14px;line-height:1.9;color:#a8a8b8;">${escapeHtml(hint)}</p>
        <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);font-size:13px;line-height:1.9;color:#9090a0;">
          <div>البريد المستهدف: ${safeEmail}</div>
          <div>إذا لم يعمل الزر، استخدم هذا الرابط مباشرة:</div>
          <div style="word-break:break-word;"><a href="${safeLink}" style="color:#8fdcff;">${safeLink}</a></div>
        </div>
      </div>
    </div>
  </body>
</html>`,
    text: [
      `${subject}`,
      ``,
      `مرحباً ${displayName || email}،`,
      isVerification
        ? `لتأكيد بريدك الإلكتروني، استخدم الرابط التالي:`
        : `لإعادة تعيين كلمة المرور، استخدم الرابط التالي:`,
      actionLink,
      ``,
      hint,
      ``,
      `${brandName}`,
      replyTo
    ].join("\n")
  };
}

async function getGoogleAccessToken(env) {
  const clientEmail = getRequiredEnv(env, "FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL");
  const privateKey = normalizePrivateKey(getRequiredEnv(env, "FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY"));
  const cacheKey = `${clientEmail}:${hashForIdempotency(privateKey)}`;

  if (
    googleAccessTokenCache.cacheKey === cacheKey &&
    googleAccessTokenCache.token &&
    Date.now() < googleAccessTokenCache.expiresAt
  ) {
    return googleAccessTokenCache.token;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const assertion = await createSignedJwt({
    iss: clientEmail,
    scope: GOOGLE_OAUTH_SCOPE,
    aud: GOOGLE_TOKEN_URL,
    iat: nowInSeconds,
    exp: nowInSeconds + 3600
  }, privateKey);

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });

  const responseBody = await parseJsonResponse(response);
  if (!response.ok || !responseBody?.access_token) {
    throw createWorkerError(
      "auth/google-access-token-failed",
      "تعذر التحقق من هوية خادم البريد.",
      502
    );
  }

  googleAccessTokenCache = {
    cacheKey,
    token: String(responseBody.access_token),
    expiresAt: Date.now() + (Math.max(300, Number(responseBody.expires_in || 3600) - 60) * 1000)
  };

  return googleAccessTokenCache.token;
}

async function createSignedJwt(payload, privateKeyPem) {
  const encodedHeader = base64UrlEncodeJson({
    alg: "RS256",
    typ: "JWT"
  });
  const encodedPayload = base64UrlEncodeJson(payload);
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const cryptoKey = await importPrivateKey(privateKeyPem);
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  return `${unsignedToken}.${base64UrlEncode(signature)}`;
}

async function importPrivateKey(privateKeyPem) {
  return crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(privateKeyPem),
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256"
    },
    false,
    ["sign"]
  );
}

function pemToArrayBuffer(privateKeyPem) {
  const normalizedPem = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const binaryString = atob(normalizedPem);
  const bytes = new Uint8Array(binaryString.length);
  for (let index = 0; index < binaryString.length; index += 1) {
    bytes[index] = binaryString.charCodeAt(index);
  }
  return bytes.buffer;
}

function normalizePrivateKey(value) {
  return String(value || "").replace(/\\n/g, "\n").trim();
}

function base64UrlEncodeJson(value) {
  return base64UrlEncode(new TextEncoder().encode(JSON.stringify(value)));
}

function base64UrlEncode(value) {
  const bytes = value instanceof ArrayBuffer ? new Uint8Array(value) : value;
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function hashForIdempotency(value) {
  let hash = 0;
  const input = String(value || "");
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash.toString(16);
}

function getRequiredEnv(env, key) {
  return String(env?.[key] || "").trim();
}

function createWorkerError(code, userMessage, status = 500) {
  const error = new Error(userMessage);
  error.code = code;
  error.userMessage = userMessage;
  error.status = status;
  return error;
}

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders
    }
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
