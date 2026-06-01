export interface ApiUser {
  id: string;
  username: string;
  email: string;
  name: string;
  image?: string;
  slotsPerDay: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: ApiUser;
}

export interface UpdateProfileRequest {
  name?: string;
  image?: string;
  slotsPerDay?: number;
}

export interface CsrfTokenResponse {
  csrfToken: string;
}
