import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { useUserSession } from "./hooks/useUserSession";

// 🚀 Lazy-loaded routes (critical for performance)
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const ChatPage = lazy(() => import("./pages/chat/ChatPage"));

const App = () => {
  const { token, user, setUser, setHydrated, isHydrated } = useAuthStore();
  useUserSession();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setHydrated(true);
  }, [setUser, setHydrated]);

  if (!isHydrated) {
    return (
      <div style={{ textAlign: "center", marginTop: "40vh" }}>
        Loading…
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", marginTop: "40vh" }}>
          Loading page…
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/chat"
          element={token && user ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Suspense>
  );
};

export default App;
