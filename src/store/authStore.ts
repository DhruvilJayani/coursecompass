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
  isHydrated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("authToken"),
  isHydrated: false,
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
  setHydrated: (hydrated) => set({ isHydrated: hydrated }),
}));
