// Axios API Client
// Single instance for all RateScope API calls

import axios from "axios";
import { API_CONFIG } from "../constants/api";

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor: unwrap { success, data } envelope
apiClient.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body.success === false) {
      const err = body.error || { code: "UNKNOWN", message: "Request failed" };
      return Promise.reject(new ApiError(err.code, err.message));
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const body = error.response.data;
      return Promise.reject(
        new ApiError(
          body?.error?.code || "HTTP_ERROR",
          body?.error?.message || error.message
        )
      );
    }
    return Promise.reject(new ApiError("NETWORK_ERROR", "Unable to connect to server"));
  }
);

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "ApiError";
  }
}
