export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        <div className="h-12 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
