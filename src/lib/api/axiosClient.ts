import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_URL } from "@/config/environment";

// ---- Types ----
interface CustomAxiosHeaders {
  _retry_csrf?: boolean;
  _retry_jwt?: boolean;
  "X-CSRF-Token"?: string;
}

interface ErrorResponse {
  message?: string;
  statusCode?: number;
}

// ---- In-memory state ----
// Flag to prevent multiple simultaneous token refresh attempts
let isRefreshing = false;
// Queue to store failed requests while token is being refreshed
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (err: unknown) => void;
  config: InternalAxiosRequestConfig;
}[] = [];

// ---- Helper functions ----

/**
 * Get CSRF token from cookie
 * The backend automatically sets this cookie on first request
 */
function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const name = "CSRF-TOKEN=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}

/**
 * Process all queued requests after token refresh completes
 * @param error - Error to reject all requests with, or null if successful
 */
function processQueue(error: Error | null) {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      resolve(api.request(config));
    }
  });
  failedQueue = [];
}

/**
 * Refresh the access token using the refresh token cookie
 */
async function refreshAccessToken(): Promise<void> {
  // Refresh endpoint is a GET request, CSRF not validated for GET
  await api.get("/auth/refresh");
}

/**
 * Clear authentication state and redirect to login
 */
function handleAuthFailure(): void {
  isRefreshing = false;
  failedQueue = [];

  // Clear any auth-related cookies if needed
  if (typeof window !== "undefined") {
    console.warn("Authentication failed. Redirecting to login...");
    // Clear state and redirect to login
    window.location.href = "/login";
  }
}

// ---- Axios instance configuration ----
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for cookie-based authentication
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- Request interceptor ----
// Automatically attach CSRF token from cookie to non-safe requests
api.interceptors.request.use((config) => {
  const method = config.method?.toUpperCase() || "";
  const safeMethods = ["GET", "HEAD", "OPTIONS"];

  // Only add CSRF token to non-safe methods
  if (!safeMethods.includes(method)) {
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }

  return config;
});

// ---- Response interceptor ----
// Handle 403 (invalid CSRF) and 401 (expired access token) errors
api.interceptors.response.use(
  (resp) => resp,
  async (error: AxiosError<ErrorResponse>) => {
    const originalConfig = (error.config as InternalAxiosRequestConfig) || {};
    if (!originalConfig || !originalConfig.url) return Promise.reject(error);

    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || "";
    const headers = originalConfig.headers as CustomAxiosHeaders;

    // Handle 403 Forbidden - Check if it's CSRF related
    if (status === 403 && errorMessage.includes("Invalid CSRF token")) {
      if (headers._retry_csrf) {
        // Already retried once, give up
        return Promise.reject(error);
      }

      headers._retry_csrf = true;

      // The backend will set a new CSRF token cookie automatically
      // Just retry the request, the interceptor will read the new token
      console.warn("CSRF token invalid, retrying request...");

      // Small delay to ensure cookie is set
      await new Promise((resolve) => setTimeout(resolve, 100));

      return api.request(originalConfig);
    }

    // Handle 401 Unauthorized - Access token expired, try to refresh
    if (status === 401 && !headers._retry_jwt) {
      headers._retry_jwt = true;

      // Queue this request if another refresh is already in progress
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalConfig });
        });
      }

      isRefreshing = true;

      try {
        await refreshAccessToken();
        isRefreshing = false;
        processQueue(null);

        // Retry the original request
        return api.request(originalConfig);
      } catch (refreshError) {
        // Refresh failed - this means refresh token is invalid/expired
        const refreshStatus = (refreshError as AxiosError)?.response?.status;
        const refreshMessage =
          (refreshError as AxiosError<ErrorResponse>)?.response?.data
            ?.message || "";

        if (
          refreshStatus === 403 &&
          refreshMessage.includes("Access Denied")
        ) {
          // Refresh token is invalid - logout user
          console.error("Refresh token invalid. Logging out user.");
          handleAuthFailure();
        } else {
          // Some other error during refresh
          isRefreshing = false;
          processQueue(refreshError as Error);
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle 403 from refresh endpoint specifically (expired refresh token)
    if (
      status === 403 &&
      originalConfig.url?.includes("/auth/refresh") &&
      errorMessage.includes("Access Denied")
    ) {
      console.error("Refresh token expired. Logging out user.");
      handleAuthFailure();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

// ---- Public API ----

/**
 * Clear authentication state (useful for logout)
 * Resets refresh state and failed request queue
 */
export function clearAuthState(): void {
  isRefreshing = false;
  failedQueue = [];
}

/**
 * Logout user and clear auth state
 * Call this when user explicitly logs out
 */
export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    clearAuthState();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}

// ---- Development logging ----
// Enable detailed request/response logging in development mode
if (process.env.NODE_ENV === "development") {
  api.interceptors.request.use((config) => {
    console.log(
      `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      config.data ? { data: config.data } : "",
      config.headers["X-CSRF-Token"]
        ? { "X-CSRF-Token": "***" + config.headers["X-CSRF-Token"].slice(-8) }
        : "",
    );
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      console.log(
        `[API Response] ${response.status} ${response.config.url}`,
        response.data,
      );
      return response;
    },
    (error) => {
      console.error(
        `[API Error] ${error.response?.status || "Network"} ${
          error.config?.url
        }`,
        error.response?.data || error.message,
      );
      return Promise.reject(error);
    },
  );
}

export default api;
