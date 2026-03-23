/**
 * Password hashing utility using SHA-256 Web Crypto API
 * Client-side hashing for ChefFlow authentication
 */

/**
 * Hash a password using SHA-256 algorithm
 * @param password - Plain text password to hash
 * @returns Promise<string> - Hexadecimal hash string
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert buffer to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Verify if a password matches a hash
 * @param password - Plain text password to verify
 * @param hash - Hash to compare against
 * @returns Promise<boolean> - True if password matches hash
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

/**
 * Check if Web Crypto API is available
 * @returns boolean - True if crypto.subtle is available
 */
export function isCryptoAvailable(): boolean {
  return typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined";
}

// Default export
export default {
  hashPassword,
  verifyPassword,
  isCryptoAvailable,
};
