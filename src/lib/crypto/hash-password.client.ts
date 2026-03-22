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
 * Generate a random salt (for future salt implementation)
 * @param length - Length of salt in bytes (default: 16)
 * @returns Promise<string> - Hexadecimal salt string
 */
export async function generateSalt(length: number = 16): Promise<string> {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Check if Web Crypto API is available
 * @returns boolean - True if crypto.subtle is available
 */
export function isCryptoAvailable(): boolean {
  return typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined";
}

/**
 * Hash password with salt (for future enhancement)
 * @param password - Plain text password
 * @param salt - Salt string
 * @returns Promise<string> - Hashed password with salt
 */
export async function hashPasswordWithSalt(
  password: string,
  salt: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Default export
export default {
  hashPassword,
  verifyPassword,
  generateSalt,
  isCryptoAvailable,
  hashPasswordWithSalt,
};
