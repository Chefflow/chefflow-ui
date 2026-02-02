import { getAuthUser } from "@/lib/auth/server";
import { NavbarClient } from "./navbar-client";

/**
 * Server Component wrapper for Navbar
 * Fetches auth state from server (secure) and passes to client component
 */
export async function NavbarServer() {
  const user = await getAuthUser();

  return <NavbarClient user={user} />;
}
