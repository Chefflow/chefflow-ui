import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Auth Store - CLIENT-SIDE UI STATE ONLY
 *
 * ⚠️ SECURITY WARNING: This store is for UI display ONLY.
 * It does NOT control access to protected routes.
 *
 * - Auth decisions happen in proxy.ts middleware and server components
 * - This store syncs user data from server for display purposes
 * - Never rely on isAuthenticated for security - it's for UI only
 *
 * Migration note: We keep localStorage to prevent UI flicker, but auth
 * validation ALWAYS happens server-side in:
 *   1. src/proxy.ts (middleware protection)
 *   2. src/lib/auth/server.ts (requireAuth & getAuthUser)
 *   3. Server Components (dashboard page, navbar)
 */

export interface User {
  username: string;
  email: string;
  name: string | null;
  image: string | null;
  provider: "LOCAL" | "GOOGLE" | "APPLE" | "GITHUB";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
