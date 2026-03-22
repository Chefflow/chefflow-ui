/**
 * Authentication client for ChefFlow API
 * Handles login, register, profile, and logout operations
 */

import { baseClient } from './base-client';
import {
  ApiUser,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UpdateProfileRequest,
  CsrfTokenResponse
} from './interface';

class AuthClient {
  async register(data: RegisterRequest) {
    return baseClient.post<AuthResponse>('/auth/register', data);
  }

  async login(data: LoginRequest) {
    return baseClient.post<AuthResponse>('/auth/login', data);
  }

  async getProfile() {
    return baseClient.get<ApiUser>('/users/me');
  }

  async logout() {
    return baseClient.post<void>('/auth/logout');
  }

  async getCsrfToken() {
    return baseClient.get<CsrfTokenResponse>('/auth/csrf');
  }

  async updateProfile(username: string, data: UpdateProfileRequest) {
    return baseClient.patch<ApiUser>(`/users/${username}`, data);
  }

  async isAuthenticated(): Promise<boolean> {
    const response = await this.getProfile();
    return baseClient.isSuccess(response);
  }

  async getCurrentUser(): Promise<ApiUser | null> {
    const response = await this.getProfile();
    if (baseClient.isSuccess(response)) {
      return response.data;
    }
    return null;
  }
}

export const authClient = new AuthClient();
export default authClient;