"use client";

import { useState } from "react";

export const useRecipeSidebar = () => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  const openSidebar = (id: number): void => setSelectedRecipeId(id);
  const closeSidebar = (): void => setSelectedRecipeId(null);

  return {
    selectedRecipeId,
    isSidebarOpen: selectedRecipeId !== null,
    openSidebar,
    closeSidebar,
  };
};
