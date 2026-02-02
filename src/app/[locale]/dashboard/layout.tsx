import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createMetadata } from "@/lib/metadata/shared";

// Force dynamic rendering since dashboard page is a client component
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";
  const t = await getTranslations({ locale, namespace: "metadata.dashboard" });

  return createMetadata(t("title"), t("description"), locale, t("keywords"));
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
