"use client";

import { CircleCheckIcon, Loader2Icon, OctagonXIcon } from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-center"
      duration={4000}
      gap={12}
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      style={{ "--width": "460px" } as React.CSSProperties}
      toastOptions={{
        classNames: {
          toast:
            "group/toast !bg-[var(--color-background)] !text-[var(--color-foreground)] !border !border-[var(--color-border)] !rounded-[var(--radius-lg)] !px-5 !py-4 !shadow-[0_16px_48px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.06)]",
          title: "!text-[14px] !font-semibold leading-snug tracking-tight",
          description:
            "!text-[12.5px] leading-relaxed !text-[var(--color-muted-foreground)] mt-0.5",
          icon: "!flex !items-center !justify-center !size-9 !rounded-[var(--radius-md)] !shrink-0",
          closeButton:
            "!bg-transparent !border-0 !text-[var(--color-muted-foreground)] opacity-0 transition-opacity group-hover/toast:opacity-100 hover:!text-[var(--color-foreground)]",
          success:
            "[&>[data-icon]]:!bg-orange-100 [&>[data-icon]]:!text-[var(--color-primary)]",
          error:
            "[&>[data-icon]]:!bg-red-100 [&>[data-icon]]:!text-[var(--color-destructive)]",
          loading: "[&>[data-icon]]:!bg-[var(--color-muted)]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
