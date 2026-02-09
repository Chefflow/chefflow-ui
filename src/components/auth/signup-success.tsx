"use client";

import { ArrowRight, CheckCircle2, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "@/i18n/routing";

interface SignupSuccessProps {
  userName: string;
  userEmail: string;
  onContinue?: () => void;
  autoRedirectSeconds?: number;
}

export function SignupSuccess({
  userName,
  userEmail,
  onContinue,
  autoRedirectSeconds = 5,
}: SignupSuccessProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(autoRedirectSeconds);

  useEffect(() => {
    if (countdown === 0) {
      if (onContinue) {
        onContinue();
      } else {
        router.push("/dashboard");
      }
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onContinue, router]);

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md border-border bg-background shadow-lg">
          <CardContent className="pt-12 pb-8 space-y-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold text-foreground">
                Welcome aboard! 🎉
              </h1>
              <p className="text-muted-foreground">
                Your account has been created successfully
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-secondary/50 rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Account Details</span>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{userName}</p>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <Button
                onClick={handleContinue}
                size="lg"
                className="w-full group"
              >
                Continue to Dashboard
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p className="text-xs text-muted-foreground">
                Redirecting automatically in{" "}
                <motion.span
                  key={countdown}
                  initial={{ scale: 1.2, color: "rgb(34 197 94)" }}
                  animate={{ scale: 1, color: "currentColor" }}
                  className="font-semibold"
                >
                  {countdown}
                </motion.span>{" "}
                {countdown === 1 ? "second" : "seconds"}...
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
