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

// ---- In-memory state ----
// CSRF token stored in memory for the session
let csrfToken: string | null = null;
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
 * Process all queued requests after token refresh completes
 * @param error - Error to reject all requests with, or null if successful
 * @param token - New CSRF token to apply to requests
 */
function processQueue(error: Error | null, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      if (token) {
        config.headers["X-CSRF-Token"] = token;
      }
      resolve(api.request(config));
    }
  });
  failedQueue = [];
}

/**
 * Fetch a new CSRF token from the server
 * @returns The CSRF token string
 */
async function fetchCsrfToken(): Promise<string> {
  const res = await api.get("/auth/csrf");
  const token = res.data?.csrfToken;
  csrfToken = token;
  return token;
}

/**
 * Refresh the access token using the refresh token cookie
 * Requires a valid CSRF token to be present
 */
async function refreshAccessToken(): Promise<void> {
  const headers: Record<string, string> = {};
  if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

  await api.get("/auth/refresh", { headers });
}

// ---- Axios instance configuration ----
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for cookie-based authentication
  headers: {
    "Content-Type": "application/json",
  },
});

// Paths that don't require CSRF token or authentication
const PUBLIC_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/csrf",
  "/auth/refresh",
  "/auth/google",
  "/auth/google/callback",
];

// ---- Request interceptor ----
// Automatically attach CSRF token to protected endpoints
api.interceptors.request.use((config) => {
  const url = config.url || "";
  if (!PUBLIC_PATHS.some((p) => url.endsWith(p))) {
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
  async (error: AxiosError) => {
    const originalConfig = (error.config as InternalAxiosRequestConfig) || {};
    if (!originalConfig || !originalConfig.url) return Promise.reject(error);

    const status = error.response?.status;
    const url = originalConfig.url;

    // Don't retry public paths
    if (PUBLIC_PATHS.some((p) => url.endsWith(p))) {
      return Promise.reject(error);
    }

    const headers = originalConfig.headers as CustomAxiosHeaders;

    // Handle 403 Forbidden - CSRF token is invalid or expired
    if (status === 403 && !headers._retry_csrf) {
      headers._retry_csrf = true; // Prevent infinite retry loop

      // Queue this request if another refresh is already in progress
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalConfig });
        });
      }

      isRefreshing = true;
      try {
        const newToken = await fetchCsrfToken();
        processQueue(null, newToken);
        isRefreshing = false;

        // Retry the original request with new CSRF token
        originalConfig.headers["X-CSRF-Token"] = newToken;
        return api.request(originalConfig);
      } catch (err) {
        isRefreshing = false;
        processQueue(err as Error, null);
        return Promise.reject(err);
      }
    }

    // Handle 401 Unauthorized - Access token expired, try to refresh
    if (status === 401 && !headers._retry_jwt) {
      headers._retry_jwt = true; // Prevent infinite retry loop

      // Queue this request if another refresh is already in progress
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalConfig });
        });
      }

      isRefreshing = true;
      try {
        // Ensure we have a CSRF token before attempting refresh
        if (!csrfToken) await fetchCsrfToken();
        await refreshAccessToken();

        isRefreshing = false;
        processQueue(null, csrfToken);

        // Retry the original request
        return api.request(originalConfig);
      } catch (err) {
        isRefreshing = false;
        processQueue(err as Error, null);

        console.error("Refresh failed. Please login again.", err);
        // Optional: redirect to login page on refresh failure
        // if (typeof window !== 'undefined') {
        //   window.location.href = '/login';
        // }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

// ---- Public API ----

/**
 * Initialize CSRF token at application startup
 * Call this at app initialization to avoid the first request failing
 * due to missing CSRF token
 */
export async function initializeCsrf(): Promise<void> {
  if (!csrfToken) {
    await fetchCsrfToken();
  }
}

/**
 * Clear authentication state (useful for logout)
 * Resets CSRF token, refresh state, and failed request queue
 */
export function clearAuthState(): void {
  csrfToken = null;
  isRefreshing = false;
  failedQueue = [];
}

// ---- Development logging ----
// Enable detailed request/response logging in development mode
if (process.env.NODE_ENV === "development") {
  api.interceptors.request.use((config) => {
    console.log(
      `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      config.data ? { data: config.data } : "",
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
        `[API Error] ${error.response?.status || "Network"} ${error.config?.url}`,
        error.response?.data || error.message,
      );
      return Promise.reject(error);
    },
  );
}

export default api;
