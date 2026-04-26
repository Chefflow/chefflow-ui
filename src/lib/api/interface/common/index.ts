export interface ApiError {
  message: string[];
  error: string;
  statusCode: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
}

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
