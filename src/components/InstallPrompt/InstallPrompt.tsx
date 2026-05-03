"use client";

import { Share, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type InstallState = "idle" | "ios" | "android";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "chefflow-pwa-dismissed";

export const InstallPrompt = () => {
  const t = useTranslations("install");
  const [state, setState] = useState<InstallState>("idle");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);

    if (isIOS) {
      setState("ios");
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setState("android");
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setState("idle");
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setState("idle");
    setDeferredPrompt(null);
  };

  if (state === "idle") return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm rounded-xl border border-border bg-white p-4 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
          <Share className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{t("title")}</p>
          {state === "ios" ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t.rich("iosInstructions", {
                shareIcon: () => <Share className="inline h-3 w-3" />,
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t("androidInstructions")}
            </p>
          )}
          {state === "android" && (
            <button
              type="button"
              onClick={install}
              className="mt-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 transition-colors"
            >
              {t("install")}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={t("close")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
