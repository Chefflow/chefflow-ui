import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "ChefFlow - Organize Your Recipes & Meal Planning",
  description:
    "Manage your recipes, plan weekly meals, and generate smart shopping lists with AI-powered analysis.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ChefFlow",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF5733",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
