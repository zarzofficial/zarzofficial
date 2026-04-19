import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Category } from "../data/products";

const CART_STORAGE_KEY = "zarz_cart";

export interface CartVariationSelection {
  groupId: string;
  groupLabel: string;
  optionId?: string;
  optionLabel: string;
}

export interface CartCustomData {
  packageLabel?: string;
  targetLink?: string;
  playerId?: string;
  server?: string;
  recipientPhone?: string;
  requirements?: string;
  referenceLink?: string;
  variations?: CartVariationSelection[];
}

export interface CartItem {
  cartId: string;
  productId: string;
  productSlug: string;
  title: string;
  category: Category;
  image: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  customData: CartCustomData;
}

interface AddItemInput {
  productId: string;
  productSlug?: string;
  title: string;
  category: Category;
  image: string;
  qty: number;
  unitPrice: number;
  customData?: CartCustomData;
}

interface LegacyCartItemInput {
  id: string;
  slug?: string;
  title: string;
  price: number;
  basePrice?: number;
  qty: number;
  image?: string;
  category?: Category;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: AddItemInput) => void;
  addToCart: (item: LegacyCartItemInput) => void;
  removeItem: (cartId: string) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function buildCartId() {
  return `cart_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeCustomData(value?: CartCustomData) {
  return {
    packageLabel: value?.packageLabel || "",
    targetLink: value?.targetLink || "",
    playerId: value?.playerId || "",
    server: value?.server || "",
    recipientPhone: value?.recipientPhone || "",
    requirements: value?.requirements || "",
    referenceLink: value?.referenceLink || "",
    variations: Array.isArray(value?.variations) ? value.variations : [],
  };
}

function buildStorageItem(item: CartItem) {
  return {
    ...item,
    totalPrice: item.unitPrice * item.qty,
    customData: normalizeCustomData(item.customData),
  };
}

function toCategory(value: unknown): Category {
  return value === "social" || value === "ai" || value === "web" || value === "gaming"
    ? value
    : "social";
}

function mapStoredItem(value: unknown): CartItem | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Record<string, unknown>;
  const productId = String(candidate.productId || candidate.id || "").trim();
  if (!productId) return null;

  const qty = Math.max(1, Number(candidate.qty || 1));
  const unitPrice = Number(candidate.unitPrice || candidate.price || 0);
  const title = String(candidate.title || "خدمة");
  const image = String(candidate.image || "/favicon.svg");
  const productSlug = String(candidate.productSlug || candidate.slug || productId);
  const category = toCategory(candidate.category);
  const customData = normalizeCustomData(candidate.customData as CartCustomData | undefined);

  return {
    cartId: String(candidate.cartId || buildCartId()),
    productId,
    productSlug,
    title,
    category,
    image,
    qty,
    unitPrice,
    totalPrice: unitPrice * qty,
    customData,
  };
}

function isPrerenderedShell() {
  if (typeof document === "undefined") return false;
  return document.getElementById("root")?.dataset.prerendered === "true";
}

function readStoredCart() {
  if (typeof window === "undefined") return [];

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!rawValue) return [];

    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) return [];

    return parsedValue
      .map((item) => mapStoredItem(item))
      .filter((item): item is CartItem => item !== null);
  } catch {
    return [];
  }
}

function readInitialCart() {
  if (typeof window === "undefined") return [];

  if (isPrerenderedShell()) {
    return [];
  }

  return readStoredCart();
}

function sameItemSignature(left: CartItem, right: AddItemInput) {
  return (
    left.productId === right.productId &&
    JSON.stringify(normalizeCustomData(left.customData)) ===
      JSON.stringify(normalizeCustomData(right.customData))
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readInitialCart);
  const [hasLoadedStoredCart, setHasLoadedStoredCart] = useState(
    () => typeof window === "undefined" || !isPrerenderedShell(),
  );

  useEffect(() => {
    setItems(readStoredCart());
    setHasLoadedStoredCart(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasLoadedStoredCart) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.map(buildStorageItem)));
  }, [hasLoadedStoredCart, items]);

  function addItem(input: AddItemInput) {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => sameItemSignature(item, input));
      if (existingItem) {
        return currentItems.map((item) =>
          item.cartId === existingItem.cartId
            ? {
                ...item,
                qty: item.qty + Math.max(1, input.qty),
                totalPrice: item.unitPrice * (item.qty + Math.max(1, input.qty)),
              }
            : item,
        );
      }

      const nextQty = Math.max(1, input.qty);
      const nextItem: CartItem = {
        cartId: buildCartId(),
        productId: input.productId,
        productSlug: input.productSlug || input.productId,
        title: input.title,
        category: input.category,
        image: input.image,
        qty: nextQty,
        unitPrice: input.unitPrice,
        totalPrice: input.unitPrice * nextQty,
        customData: normalizeCustomData(input.customData),
      };

      return [...currentItems, nextItem];
    });
  }

  function addToCart(input: LegacyCartItemInput) {
    addItem({
      productId: input.id,
      productSlug: input.slug || input.id,
      title: input.title || "خدمة",
      category: input.category || "social",
      image: input.image || "/favicon.svg",
      qty: Math.max(1, input.qty),
      unitPrice: Number(input.price || input.basePrice || 0),
    });
  }

  function removeItem(cartId: string) {
    setItems((currentItems) => currentItems.filter((item) => item.cartId !== cartId));
  }

  function removeFromCart(id: string) {
    setItems((currentItems) => {
      const matchingByCartId = currentItems.filter((item) => item.cartId !== id);
      if (matchingByCartId.length !== currentItems.length) return matchingByCartId;
      return currentItems.filter((item) => item.productId !== id);
    });
  }

  function updateQty(id: string, qty: number) {
    const nextQty = Math.max(1, qty);
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.cartId === id || item.productId === id
          ? { ...item, qty: nextQty, totalPrice: item.unitPrice * nextQty }
          : item,
      ),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0),
    [items],
  );
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addToCart,
        removeItem,
        removeFromCart,
        updateQty,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
