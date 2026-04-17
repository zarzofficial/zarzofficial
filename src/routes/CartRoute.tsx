import { AuthProvider } from "../lib/AuthContext";
import { Cart } from "../pages/Cart";

export default function CartRoute() {
  return (
    <AuthProvider>
      <Cart />
    </AuthProvider>
  );
}
