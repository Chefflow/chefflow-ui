export const RECIPE_KEYS = {
  all: ["recipes"] as const,
  detail: (id: string | number) => ["recipes", id] as const,
};

export const PLANNING_KEYS = {
  all: ["plannings"] as const,
  detail: (id: number) => ["plannings", id] as const,
};
