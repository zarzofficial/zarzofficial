export const VISITOR_VIEW_HIDDEN_KEY = "zarz_visitor_view_hidden";

export function readVisitorViewHidden() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(VISITOR_VIEW_HIDDEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeVisitorViewHidden(value: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      window.localStorage.setItem(VISITOR_VIEW_HIDDEN_KEY, "1");
    } else {
      window.localStorage.removeItem(VISITOR_VIEW_HIDDEN_KEY);
    }
  } catch {
    // Ignore storage failures.
  }
}

export function isVisitorViewHiddenFor(user: { isAnonymous?: boolean } | null | undefined) {
  return Boolean(user?.isAnonymous && readVisitorViewHidden());
}
