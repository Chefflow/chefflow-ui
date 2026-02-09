"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SignupError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Signup page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-12">
      <Card className="w-full max-w-md border-border bg-background shadow-sm">
        <CardHeader className="space-y-1 pb-6 pt-8 text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground">
            We encountered an error loading the signup page
          </p>
        </CardHeader>

        <CardContent className="space-y-4 pb-8">
          {error.digest && (
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            </div>
          )}

          <Button onClick={reset} className="w-full">
            Try again
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Go to homepage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
