import type { ReactNode } from "react";
import { CartProvider } from "../lib/CartContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
