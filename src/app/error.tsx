"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-foreground">
          Something went wrong!
        </h1>
        <p className="text-muted-foreground">
          We're sorry for the inconvenience.
        </p>
        <Button onClick={reset} size="lg">
          Try again
        </Button>
      </div>
    </div>
  );
}
