"use client";

import { Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Locale, localeFlags, localeNames, locales } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/routing";

export default function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale as Locale });
    });
  };

  return (
    <div className="relative inline-block">
      <Select
        value={locale}
        onValueChange={handleLanguageChange}
        disabled={isPending}
      >
        <SelectTrigger
          className="w-[180px] bg-secondary border-2 border-primary hover:bg-primary hover:text-primary transition-all duration-200"
          aria-label="Select language"
        >
          <SelectValue>
            <span className="flex items-center gap-2">
              <span>{localeFlags[locale as Locale]}</span>
              <span className="font-bold">{localeNames[locale as Locale]}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
              <span className="flex items-center gap-2">
                <span>{localeFlags[loc]}</span>
                <span className="font-bold">{localeNames[loc]}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md pointer-events-none">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
