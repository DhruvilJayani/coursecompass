import apiClient from "./apiClient";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phoneNo: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface OtpLoginPayload {
  phoneNo: string;
}

interface VerifyOtpPayload {
  phoneNo: string;
  otp: string;
}

export const registerUser = (data: RegisterPayload) => apiClient.post("/auth/register", data);
export const loginUser = (data: LoginPayload) => apiClient.post("/auth/login", data);
export const otpLogin = (data: OtpLoginPayload) => apiClient.post("/auth/otp-login", data);
export const verifyOtp = (data: VerifyOtpPayload) => apiClient.post("/auth/verify-otp", data);
export const getUser = () => apiClient.get("/auth/get-user");
