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
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../../services/authService";
import { useThemeContext } from "../../context/ThemeProvider";
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
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const { mode, toggleTheme } = useThemeContext();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      await registerUser(data);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => (window.location.href = "/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"
      sx={{ background: mode === "light" ? "linear-gradient(135deg, #dfe9f3 0%, #ffffff 100%)" : "#121212" }}>
      <Card sx={{ width: 420, borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h5" fontWeight={600}>Create Account ✨</Typography>
            <Tooltip title="Toggle theme">
              <IconButton onClick={toggleTheme}>
                {mode === "light" ? <Brightness4RoundedIcon /> : <Brightness7RoundedIcon />}
              </IconButton>
            </Tooltip>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField label="Full Name" fullWidth margin="normal" {...register("name")}
              error={!!errors.name} helperText={errors.name?.message} />
            <TextField label="Email" fullWidth margin="normal" {...register("email")}
              error={!!errors.email} helperText={errors.email?.message} />
            <TextField label="Phone Number" fullWidth margin="normal" {...register("phoneNo")}
              error={!!errors.phoneNo} helperText={errors.phoneNo?.message} />
            <TextField label="Password" type="password" fullWidth margin="normal"
              {...register("password")} error={!!errors.password}
              helperText={errors.password?.message} />
            {error && <Typography color="error" variant="body2" mt={1}>{error}</Typography>}
            {success && <Typography color="primary" variant="body2" mt={1}>{success}</Typography>}
            <Button fullWidth variant="contained" sx={{ mt: 3, py: 1.2 }} type="submit"
              disabled={loading}>{loading ? <CircularProgress size={24} /> : "Register"}</Button>
          </form>
          <Typography textAlign="center" mt={3} fontSize={14}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#1976d2", textDecoration: "none" }}>Login</a>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
