export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        <p className="mt-4 text-lg font-medium text-foreground">
          Loading ChefFlow...
        </p>
      </div>
    </div>
  );
}
