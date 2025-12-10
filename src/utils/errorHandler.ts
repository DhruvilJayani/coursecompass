import axios, { AxiosError } from "axios";

/**
 * API Error response structure from backend
 */
export interface ApiErrorResponse {
  message: string;
  errorCode?: string;
  statusCode?: number;
}

/**
 * Extracts user-friendly error message from API response
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // Network error (no response from server)
    if (!axiosError.response) {
      if (axiosError.code === "ERR_NETWORK") {
        return "Unable to connect to server. Please check your internet connection or verify the backend is running.";
      }
      if (axiosError.code === "ECONNABORTED") {
        return "Request timeout. Please try again.";
      }
      return "Network error. Please try again.";
    }

    // Extract error message from response
    const { status, data } = axiosError.response;

    // If backend provides a specific error message, use it
    if (data?.message) {
      return data.message;
    }

    // Handle specific status codes with fallback messages
    switch (status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Authentication required. Please log in.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "Resource not found.";
      case 409:
        return "Conflict. Resource already exists.";
      case 422:
        return "Validation error. Please check your input.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
};

/**
 * Checks if error is an authentication error (401 or 403)
 */
export const isAuthError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    return status === 401 || status === 403;
  }
  return false;
};

/**
 * Checks if error is a network error (no response)
 */
export const isNetworkError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return !error.response;
  }
  return false;
};
