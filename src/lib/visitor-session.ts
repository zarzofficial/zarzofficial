const VISITOR_SESSION_PAUSED_KEY = "zarz_visitor_session_paused";

export function readVisitorSessionPaused() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(VISITOR_SESSION_PAUSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function pauseVisitorSession() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VISITOR_SESSION_PAUSED_KEY, "1");
  } catch {
    // Ignore storage failures.
  }
}

export function resumeVisitorSession() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(VISITOR_SESSION_PAUSED_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export function isVisitorSessionPausedFor(user: { isAnonymous?: boolean } | null | undefined) {
  return Boolean(user?.isAnonymous && readVisitorSessionPaused());
}
