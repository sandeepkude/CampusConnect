import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cc_user") || "null"); } catch { return null; }
  });

  async function login(email, password) {
    const data = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    localStorage.setItem("cc_token", data.token);
    localStorage.setItem("cc_user", JSON.stringify(data.user));
    setUser(data.user);
  }
  async function register(values) {
    const data = await api("/auth/register", { method: "POST", body: JSON.stringify(values) });
    localStorage.setItem("cc_token", data.token);
    localStorage.setItem("cc_user", JSON.stringify(data.user));
    setUser(data.user);
  }
  function logout() {
    localStorage.removeItem("cc_token");
    localStorage.removeItem("cc_user");
    setUser(null);
  }
  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
