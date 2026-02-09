"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { calculatePasswordStrength } from "@/lib/validation/password-strength";

interface PasswordStrengthMeterProps {
  password: string;
  showFeedback?: boolean;
}

export function PasswordStrengthMeter({
  password,
  showFeedback = true,
}: PasswordStrengthMeterProps) {
  const strength = calculatePasswordStrength(password);

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Password strength:</span>
        <motion.span
          key={strength.label}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-medium"
        >
          {strength.label}
        </motion.span>
      </div>

      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${strength.color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${strength.percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {showFeedback && strength.feedback.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-1 pt-1"
        >
          <p className="text-xs text-muted-foreground">Requirements:</p>
          <ul className="space-y-1">
            {strength.feedback.map((item) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <XCircle className="h-3 w-3 text-red-500" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {showFeedback && strength.score === 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-xs text-green-600 pt-1"
        >
          <CheckCircle2 className="h-3 w-3" />
          <span>Password meets all requirements!</span>
        </motion.div>
      )}
    </div>
  );
}
