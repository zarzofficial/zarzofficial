import { AuthProvider } from "../lib/AuthContext";
import { Account } from "../pages/Account";

export default function AccountRoute() {
  return (
    <AuthProvider>
      <Account />
    </AuthProvider>
  );
}
