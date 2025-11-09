import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ChatPage from "./pages/chat/ChatPage";
import { useAuthStore } from "./store/authStore";
import { useUserSession } from "./hooks/useUserSession";

const App = () => {
  const { token, user, setUser, setHydrated, isHydrated } = useAuthStore();
  useUserSession();

  useEffect(() => {
    // restore user if found in localStorage (for mock login)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setHydrated(true);
  }, [setUser, setHydrated]);

  // Wait until Zustand finishes restoring before routing
  if (!isHydrated) return <div style={{ textAlign: "center", marginTop: "40vh" }}>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/chat"
        element={token && user ? <ChatPage /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
