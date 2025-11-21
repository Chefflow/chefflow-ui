/**
 * Hashes a password using SHA-256 before sending it to the server.
 * This provides an additional layer of security by ensuring passwords
 * never travel in plain text, even over HTTPS.
 *
 * Note: The backend should still perform proper password hashing
 * (e.g., bcrypt, argon2) for storage. This is just for transport security.
 */
export async function hashPassword(password: string): Promise<string> {
  // Convert password to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}
