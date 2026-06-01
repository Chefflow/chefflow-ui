import { DashboardClient } from "./DashboardClient";

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function DashboardPage({
  params,
  searchParams,
}: DashboardPageProps) {
  const _resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams?.tab;

  const initialTab = tab === "planning" || tab === "settings" ? tab : "recipes";

  return <DashboardClient initialTab={initialTab} />;
}
