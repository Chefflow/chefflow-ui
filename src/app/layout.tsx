import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChefFlow - Organize Your Recipes & Meal Planning",
  description:
    "Manage your recipes, plan weekly meals, and generate smart shopping lists with AI-powered analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
