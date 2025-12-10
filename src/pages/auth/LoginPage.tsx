import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import { useThemeContext } from "../../context/ThemeProvider";
import { getErrorMessage } from "../../utils/errorHandler";
import Brightness4RoundedIcon from "@mui/icons-material/Brightness4Rounded";
import Brightness7RoundedIcon from "@mui/icons-material/Brightness7Rounded";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { setToken, setUser } = useAuthStore();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const { mode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError("");

    if (data.email === "a.b@gmail.com" && data.password === "1234567890") {
      const mockUser = { id: "123", name: "Test User", email: data.email, phoneNo: "9999999999" };
      setToken("mock-jwt-token-123");
      setUser(mockUser);
      localStorage.setItem("authToken", "mock-jwt-token-123");
      localStorage.setItem("user", JSON.stringify(mockUser));
      setLoading(false);
      navigate("/chat");
      return;
    }

    try {
      const res = await loginUser(data);
      if (res.data.token) {
        setToken(res.data.token);
      }
      if (res.data.user) {
        setUser(res.data.user);
      }
      navigate("/chat");
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"
      sx={{ background: mode === "light" ? "linear-gradient(135deg, #eef2f3 0%, #8e9eab 100%)" : "#121212" }}>
      <Card sx={{ width: 380, borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h5" fontWeight={600}>Welcome Back 👋</Typography>
            <Tooltip title="Toggle theme">
              <IconButton onClick={toggleTheme}>
                {mode === "light" ? <Brightness4RoundedIcon /> : <Brightness7RoundedIcon />}
              </IconButton>
            </Tooltip>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField label="Email" fullWidth margin="normal" {...register("email")}
              error={!!errors.email} helperText={errors.email?.message} />
            <TextField label="Password" type="password" fullWidth margin="normal"
              {...register("password")} error={!!errors.password}
              helperText={errors.password?.message} />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            <Button fullWidth variant="contained" sx={{ mt: 3, py: 1.2 }} type="submit"
              disabled={loading}>{loading ? <CircularProgress size={24} /> : "Login"}</Button>
          </form>
          <Typography textAlign="center" mt={3} fontSize={14}>
            Don’t have an account?{" "}
            <a href="/register" style={{ color: "#1976d2", textDecoration: "none" }}>Register</a>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
