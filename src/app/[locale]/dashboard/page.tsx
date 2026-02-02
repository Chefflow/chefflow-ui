import { requireAuth } from "@/lib/auth/server";
import { DashboardClient } from "./dashboard-client";

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function DashboardPage({
  params,
  searchParams,
}: DashboardPageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams?.tab;

  // Server-side auth check - auto-redirects if not authenticated
  // This is the ONLY place where auth is checked for security
  const user = await requireAuth(locale);

  // Pass user to client component for UI only
  return (
    <DashboardClient
      user={user}
      initialTab={tab === "planning" ? "planning" : "recipes"}
    />
  );
}
