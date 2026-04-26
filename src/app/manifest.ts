import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ChefFlow",
    short_name: "ChefFlow",
    description: "Manage your recipes, plan weekly meals, and generate smart shopping lists.",
    start_url: "/en",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#FF5733",
    orientation: "portrait",
    categories: ["food", "lifestyle", "productivity"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
