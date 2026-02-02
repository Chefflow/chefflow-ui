import type { Metadata } from "next";

export function createMetadata(
  title: string,
  description: string,
  locale: string,
  keywords?: string,
): Metadata {
  return {
    title: `${title} | ChefFlow`,
    description,
    keywords,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    ),
    openGraph: {
      title: `${title} | ChefFlow`,
      description,
      locale,
      type: "website",
      siteName: "ChefFlow",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ChefFlow`,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
