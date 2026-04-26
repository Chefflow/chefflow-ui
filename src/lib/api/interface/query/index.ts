export interface QueryConfig {
  staleTime: number;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  retry?: number | boolean;
}

export const CACHE_CONFIG = {
  PROFILE: { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false },
  RECIPES: { staleTime: 10 * 60 * 1000, refetchOnWindowFocus: false },
  INGREDIENTS: { staleTime: 10 * 60 * 1000, refetchOnWindowFocus: false },
  STEPS: { staleTime: 10 * 60 * 1000, refetchOnWindowFocus: false },
  PLANNING: { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false },
} as const;
