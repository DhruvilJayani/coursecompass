import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { getUser } from "../services/authService";

export const useUserSession = () => {
  const { token, setUser, logout } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await getUser();
        setUser(res.data.user);
      } catch (error: any) {
        // Invalid or expired token
        console.warn("Session expired or invalid:", error.response?.data?.message);
        logout();
      }
    };

    fetchUser();
  }, [token, setUser, logout]);
};
