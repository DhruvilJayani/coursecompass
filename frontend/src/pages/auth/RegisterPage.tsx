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
import { registerUser } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import { useThemeContext } from "../../context/ThemeProvider";
import { getErrorMessage } from "../../utils/errorHandler";

import Brightness4RoundedIcon from "@mui/icons-material/Brightness4Rounded";
import Brightness7RoundedIcon from "@mui/icons-material/Brightness7Rounded";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phoneNo: z.string().regex(/^[0-9]{10}$/, "Must be 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { setToken, setUser } = useAuthStore();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const { mode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await registerUser(data);
      setSuccess("Account created! Redirecting to chat...");

      if (res.data.token) setToken(res.data.token);
      if (res.data.user) setUser(res.data.user);

      setTimeout(() => navigate("/chat"), 1000);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background:
          mode === "light"
            ? "linear-gradient(135deg, #dfe9f3 0%, #ffffff 100%)"
            : "#121212",
      }}
    >
      <Card sx={{ width: 420, borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h5" fontWeight={600}>
              Create Account ✨
            </Typography>

            <Tooltip title="Toggle theme">
              <IconButton
                onClick={toggleTheme}
                aria-label="Toggle light or dark theme"
              >
                {mode === "light" ? (
                  <Brightness4RoundedIcon />
                ) : (
                  <Brightness7RoundedIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} aria-label="Registration form">
            <TextField
              label="Full Name"
              aria-label="Full name"
              fullWidth
              margin="normal"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              label="Email"
              aria-label="Email address"
              fullWidth
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Phone Number"
              aria-label="Phone number"
              fullWidth
              margin="normal"
              {...register("phoneNo")}
              error={!!errors.phoneNo}
              helperText={errors.phoneNo?.message}
            />

            <TextField
              label="Password"
              aria-label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            {error && (
              <Alert
                severity="error"
                sx={{ mt: 2 }}
                aria-live="assertive"
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mt: 2 }} aria-live="polite">
                {success}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, py: 1.2 }}
              type="submit"
              aria-label="Register button"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Register"}
            </Button>
          </form>

          {/* Footer */}
          <Typography textAlign="center" mt={3} fontSize={14}>
            Already have an account?{" "}
            <a
              href="/login"
              style={{ color: "#1976d2", textDecoration: "none" }}
              aria-label="Navigate to login page"
            >
              Login
            </a>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
