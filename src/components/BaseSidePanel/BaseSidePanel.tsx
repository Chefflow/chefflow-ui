"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface BaseSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
}

export const BaseSidePanel = ({
  isOpen,
  onClose,
  label,
  children,
}: BaseSidePanelProps): React.ReactElement => {
  const t = useTranslations("common");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]",
          "transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Side panel — always in DOM, slides via CSS transform */}
      <aside
        aria-label={label}
        aria-hidden={!isOpen}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col",
          "w-[90vw] max-w-[520px] min-w-[380px]",
          "bg-secondary border-l border-border",
          "shadow-[-12px_0_40px_oklch(20%_0.04_40_/_0.14)]",
          "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground"
            onClick={onClose}
            aria-label={t("closePanel")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-6 py-5 pb-12">{children}</div>
        </ScrollArea>
      </aside>
    </>
  );
};
