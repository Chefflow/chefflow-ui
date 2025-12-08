import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_URL } from "@/config/environment";

interface CustomAxiosHeaders {
  _retry_jwt?: boolean;
}

interface ErrorResponse {
  message?: string;
  statusCode?: number;
}

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (err: unknown) => void;
  config: InternalAxiosRequestConfig;
}[] = [];

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

async function refreshAccessToken(): Promise<void> {
  await api.get("/auth/refresh");
}

function handleAuthFailure(): void {
  isRefreshing = false;
  failedQueue = [];

  if (typeof window !== "undefined") {
    console.warn("Authentication failed. Redirecting to login...");
    window.location.href = "/login";
  }
}

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (resp) => resp,
  async (error: AxiosError<ErrorResponse>) => {
    const originalConfig = (error.config as InternalAxiosRequestConfig) || {};
    if (!originalConfig || !originalConfig.url) return Promise.reject(error);

    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || "";
    const headers = originalConfig.headers as CustomAxiosHeaders;

    if (status === 401 && !headers._retry_jwt) {
      headers._retry_jwt = true;

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

        return api.request(originalConfig);
      } catch (refreshError) {
        const refreshStatus = (refreshError as AxiosError)?.response?.status;
        const refreshMessage =
          (refreshError as AxiosError<ErrorResponse>)?.response?.data
            ?.message || "";

        if (refreshStatus === 403 && refreshMessage.includes("Access Denied")) {
          console.error("Refresh token invalid. Logging out user.");
          handleAuthFailure();
        } else {
          isRefreshing = false;
          processQueue(refreshError as Error);
        }

        return Promise.reject(refreshError);
      }
    }

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

export function clearAuthState(): void {
  isRefreshing = false;
  failedQueue = [];
}

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
