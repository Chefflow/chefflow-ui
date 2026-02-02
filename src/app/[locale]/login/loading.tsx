export default function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
