import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { getUser } from "../services/authService";

export const useUserSession = () => {
  const { token, setUser, logout } = useAuthStore();

  useEffect(() => {
  if (!token) return;

  // 🚫 Skip API call for mock tokens (during frontend-only testing)
  if (token.startsWith("mock")) {
    console.log("⚙️ Mock token detected — skipping get-user check");
    return;
  }

  const fetchUser = async () => {
    try {
      const res = await getUser();
      setUser(res.data.user);
    } catch (error: any) {
      console.warn("Session expired or invalid:", error.response?.data?.message);
      logout();
    }
  };

  fetchUser();
}, [token, setUser, logout]);

};
