import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { env } from "../config/env";
import { getErrorMessage, isAuthError } from "../utils/errorHandler";

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 second timeout
});

// Request interceptor - attach auth token and log requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers["auth-token"] = token;
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and log responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Log error responses
    if (import.meta.env.DEV) {
      console.error("[API Response Error]", {
        message: getErrorMessage(error),
        error,
      });
    }

    // Handle authentication errors - clear token
    if (isAuthError(error)) {
      localStorage.removeItem("authToken");
      // Optionally redirect to login page
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
