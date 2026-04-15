import type { ReactNode } from "react";
import { AuthProvider } from "../lib/AuthContext";
import { CartProvider } from "../lib/CartContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
