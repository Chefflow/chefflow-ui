import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface User {
  id: string;
  username: string;
  email: string;
  name: string | null;
  image: string | null;
  provider: "LOCAL" | "GOOGLE" | "APPLE" | "GITHUB";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user: User) =>
        set({ user, isAuthenticated: true, isLoading: false }),
      clearUser: () =>
        set({ user: null, isAuthenticated: false, isLoading: false }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state: AuthState) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
