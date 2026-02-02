"use client";

import { ChefHat, LogOut, User as UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";
import LanguageSelector from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/routing";
import { logout } from "@/lib/api/axiosClient";
import { type User, useAuthStore } from "@/store/auth-store";

interface NavbarClientProps {
  user: User | null;
}

/**
 * Client Component for Navbar
 * Receives user from server component (secure auth)
 * Syncs to Zustand store for UI state only
 */
export function NavbarClient({ user: serverUser }: NavbarClientProps) {
  const pathname = usePathname();
  const t = useTranslations("navbar");
  const { user, setUser, clearUser } = useAuthStore();
  const isHomePage = pathname === "/" || pathname.match(/^\/[a-z]{2}$/);

  // Sync server auth state to client store (UI only, not for security)
  useEffect(() => {
    if (serverUser) {
      setUser(serverUser);
    }
  }, [serverUser, setUser]);

  const handleLogout = async () => {
    clearUser();
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAuthenticated = !!user;

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
            {!isAuthenticated && isHomePage && (
              <Button asChild variant="outline" size="sm">
                <Link href="/login">{t("login")}</Link>
              </Button>
            )}

            {isAuthenticated && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {user.name || user.username}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {user.name || user.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}
