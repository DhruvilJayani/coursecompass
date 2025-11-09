import { create } from "zustand";

interface User {
  id?: string;
  name?: string;
  email?: string;
  phoneNo?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("authToken"),
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("authToken");
    set({ user: null, token: null });
  },
}));
