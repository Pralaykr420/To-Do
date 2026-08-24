import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { googleSignIn } from "../api/authApi.js";

const AuthContext = createContext(null);

const STORAGE_KEY = "orbit_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // true once we've checked localStorage

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.user && parsed?.token) {
          setUser(parsed.user);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    const data = await googleSignIn(credential);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: data.user, token: data.token }));
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
