import { cookies } from "next/headers";

/**
 * Checks if a user is logged in.
 *
 * Informational only; does not attempt to refresh the access token.
 */
export async function isLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get("access_token");
}
