import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4">
      <div className="space-y-4 text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Button asChild size="lg">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
