import apiClient from "./apiClient";
import { AxiosResponse } from "axios";

// Request payload interfaces
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phoneNo: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface OtpLoginPayload {
  phoneNo: string;
}

export interface VerifyOtpPayload {
  phoneNo: string;
  otp: string;
}

// Response interfaces
export interface UserData {
  id?: string;
  name: string;
  email: string;
  phoneNo: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: UserData;
}

export interface GetUserResponse {
  message: string;
  user: UserData;
}

// API service functions with proper typing
export const registerUser = (data: RegisterPayload): Promise<AxiosResponse<AuthResponse>> =>
  apiClient.post("/auth/register", data);

export const loginUser = (data: LoginPayload): Promise<AxiosResponse<AuthResponse>> =>
  apiClient.post("/auth/login", data);

export const otpLogin = (data: OtpLoginPayload): Promise<AxiosResponse<{ message: string }>> =>
  apiClient.post("/auth/otp-login", data);

export const verifyOtp = (data: VerifyOtpPayload): Promise<AxiosResponse<AuthResponse>> =>
  apiClient.post("/auth/verify-otp", data);

export const getUser = (): Promise<AxiosResponse<GetUserResponse>> =>
  apiClient.get("/auth/get-user");
