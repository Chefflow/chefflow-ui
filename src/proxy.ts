import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const isAuthenticated = !!accessToken;

  const localeMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  const locale = localeMatch?.[1];

  const validLocales = ["en", "es", "fr", "de", "it"];
  if (!locale || !validLocales.includes(locale)) {
    return intlMiddleware(request);
  }

  const pathnameWithoutLocale = pathname.slice(`/${locale}`.length) || "/";

  const protectedRoutes = ["/dashboard"];
  const authRoutes = ["/login", "/signup"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route),
  );

  if (isProtectedRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export default function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/trpc") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/_vercel") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return intlMiddleware(request);
  }

  return authMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
