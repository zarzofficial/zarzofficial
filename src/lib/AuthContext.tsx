import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "firebase/auth";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    void import("./firebase")
      .then(({ auth, onAuthStateChanged }) => {
        if (!active) return;

        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!active) return;
          setCurrentUser(user);
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error("Auth bootstrap failed", error);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
