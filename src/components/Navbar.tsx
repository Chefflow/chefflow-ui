"use client";

import { ChefHat } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSelector from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("navbar");
  const isHomePage = pathname === "/" || pathname.match(/^\/[a-z]{2}$/);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <ChefHat className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
            <span className="font-serif text-xl font-bold text-foreground sm:text-2xl">
              ChefFlow
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isHomePage && (
              <Button asChild variant="outline" size="sm">
                <Link href="/login">{t("login")}</Link>
              </Button>
            )}
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}
