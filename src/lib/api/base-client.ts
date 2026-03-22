/**
 * Base client for API requests with JWT cookie authentication
 * Following ChefFlow UI authentication integration specs
 */

import type { ApiError, ApiResponse } from "./interface";
import type { LoginRequest, RegisterRequest, UpdateProfileRequest } from "./interface";

class BaseClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 204) {
        return { data: null as T };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          error: {
            message: Array.isArray(data.message)
              ? data.message
              : [data.message],
            error: data.error || "Unknown Error",
            statusCode: response.status,
          },
        };
      }

      return { data };
    } catch (error) {
      return {
        error: {
          message: ["Network error or server unavailable"],
          error: "NetworkError",
          statusCode: 0,
        },
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data as Record<string, unknown>) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data as Record<string, unknown>) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  isSuccess<T>(response: ApiResponse<T>): response is { data: T } {
    return response.data !== undefined;
  }

  isError<T>(response: ApiResponse<T>): response is { error: ApiError } {
    return response.error !== undefined;
  }

  getErrorMessage(error: ApiError): string {
    return error.message[0] || "An unexpected error occurred";
  }
}

export const baseClient = new BaseClient();
export default baseClient;
