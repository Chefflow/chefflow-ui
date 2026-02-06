"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { ErrorDisplayConfig } from "@/domain/auth/errors";

interface ErrorAlertProps {
  config: ErrorDisplayConfig;
}

export function ErrorAlert({ config }: ErrorAlertProps) {
  const [countdown, setCountdown] = useState(config.countdown);

  useEffect(() => {
    if (!countdown) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <Alert variant={config.variant} className="border-l-4 shadow-md">
          <config.icon className="h-4 w-4" />
          <AlertTitle className="font-semibold">{config.title}</AlertTitle>
          <AlertDescription className="mt-2 space-y-3">
            <p className="text-sm">{config.description}</p>

            {config.suggestions && config.suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium opacity-75">Try these:</p>
                <div className="flex flex-wrap gap-2">
                  {config.suggestions.map((suggestion, i) => (
                    <motion.div
                      key={suggestion}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(suggestion);
                        }}
                      >
                        {suggestion}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {config.actions && config.actions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {config.actions.map((action, i) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Button
                      variant={action.variant || "outline"}
                      size="sm"
                      asChild={!!action.href}
                      onClick={action.action}
                    >
                      {action.href ? (
                        <Link href={action.href}>{action.label}</Link>
                      ) : (
                        action.label
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}

            {countdown !== undefined && countdown > 0 && (
              <div className="text-sm font-medium">
                Try again in {countdown} second{countdown !== 1 ? "s" : ""}
              </div>
            )}
          </AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}
