"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
}

const loadingStates = [
  { text: "Validating information...", duration: 800 },
  { text: "Securing your data...", duration: 600 },
  { text: "Almost there...", duration: 400 },
];

export function SubmitButton({
  children,
  loadingText,
  className,
  disabled = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const [currentStateIndex, setCurrentStateIndex] = useState(0);

  useEffect(() => {
    if (!pending) {
      setCurrentStateIndex(0);
      return;
    }

    let elapsedTime = 0;

    const interval = setInterval(() => {
      elapsedTime += 100;
      let accumulatedDuration = 0;

      for (let i = 0; i < loadingStates.length; i++) {
        accumulatedDuration += loadingStates[i].duration;
        if (elapsedTime < accumulatedDuration) {
          setCurrentStateIndex(i);
          break;
        }
      }

      if (elapsedTime >= accumulatedDuration) {
        setCurrentStateIndex(loadingStates.length - 1);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [pending]);

  const currentLoadingText =
    loadingText || loadingStates[currentStateIndex].text;

  return (
    <Button
      type="submit"
      className={className}
      size="lg"
      disabled={disabled || pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {currentLoadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
