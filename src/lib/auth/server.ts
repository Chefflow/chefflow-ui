import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@/store/auth-store";

interface AuthResponse {
  user: User;
}

/**
 * Server-side auth check - redirects if not authenticated
 * Use in Server Components to protect routes
 *
 * @param locale - The locale for redirect URL (default: 'en')
 * @returns The authenticated user
 * @throws Redirects to login page if not authenticated
 */
export async function requireAuth(locale: string = "en"): Promise<User> {
  const cookieStore = await cookies();
  const hasAuth =
    cookieStore.has("accessToken") || cookieStore.has("refreshToken");

  if (!hasAuth) {
    redirect(`/${locale}/login`);
  }

  // Fetch user profile from backend (validates cookies)
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/auth/profile`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      redirect(`/${locale}/login`);
    }

    const data: AuthResponse = await response.json();
    return data.user;
  } catch (error) {
    console.error("Auth check failed:", error);
    redirect(`/${locale}/login`);
  }
}

/**
 * Optional auth - returns null if not authenticated
 * Use when authentication is optional (e.g., in Navbar)
 *
 * @returns The authenticated user or null
 */
export async function getAuthUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const hasAuth =
    cookieStore.has("accessToken") || cookieStore.has("refreshToken");

  if (!hasAuth) return null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/auth/profile`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data: AuthResponse = await response.json();
    return data.user;
  } catch {
    return null;
  }
}
