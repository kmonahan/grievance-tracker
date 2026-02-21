/**
 * @file
 * Edge-runtime-safe shared utilities
 */

/**
 * Options for the access_token cookie
 */
export function accessTokenCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(Date.now() + 60 * 60 * 1000),
  };
}

/**
 * Refreshes access_token cookie using the refresh_token cookie
 */
export async function fetchRefreshedAccessToken(
  refreshToken: string,
): Promise<string | null> {
  const response = await fetch(`${process.env.BACKEND_URL}/users/refresh`, {
    method: "POST",
    headers: { Authorization: `Bearer ${refreshToken}` },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as { access_token: string };
  return data.access_token ?? null;
}
