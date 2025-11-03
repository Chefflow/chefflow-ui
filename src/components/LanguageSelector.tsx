"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { type Locale, localeFlags, localeNames, locales } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/routing";

export default function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="relative inline-block">
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value as Locale)}
        disabled={isPending}
        className="appearance-none bg-secondary text-foreground border-2 border-primary rounded-[var(--radius-md)] px-4 py-2 pr-10 font-sans text-sm font-medium cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-[var(--shadow-subtle)]"
        aria-label="Select language"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeFlags[loc]} {localeNames[loc]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-foreground">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-[var(--radius-md)]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
