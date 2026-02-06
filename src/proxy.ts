import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Run i18n middleware first
  const intlResponse = intlMiddleware(request);

  // Extract locale from pathname (Next.js 16+ uses proxy.ts pattern)
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split("/")[1] || "en";

  // Protected routes (locale-aware) - require authentication
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathname === `/${locale}${route}` ||
      pathname.startsWith(`/${locale}${route}/`),
  );

  // Public-only routes (redirect authenticated users away)
  const publicOnlyRoutes = ["/login", "/signup"];
  const isPublicOnlyRoute = publicOnlyRoutes.some(
    (route) => pathname === `/${locale}${route}`,
  );

  // Check auth cookies (backend sets these as HTTP-only cookies)
  // Note: We only check accessToken here. The refreshToken cookie has path='/auth/refresh'
  // by design (security best practice - principle of least privilege). Token refresh is
  // handled automatically by the HTTP client when receiving 401 responses.
  const hasAuthCookie = request.cookies.has("accessToken");

  // Protect routes - redirect unauthenticated users to login
  if (isProtectedRoute && !hasAuthCookie) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from public-only routes to dashboard
  if (isPublicOnlyRoute && hasAuthCookie) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return intlResponse;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
