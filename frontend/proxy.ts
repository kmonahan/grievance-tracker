import { type NextRequest, NextResponse } from "next/server";
import { isTokenExpiredOrExpiringSoon } from "~/app/lib/jwt";
import {
  accessTokenCookieOptions,
  fetchRefreshedAccessToken,
} from "~/app/lib/token";

const PUBLIC_ROUTES = ["/login"];
const REFRESH_THRESHOLD_SECONDS = 15 * 60; // 15 minutes

// Deduplicates concurrent refresh requests
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      return await fetchRefreshedAccessToken(refreshToken);
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Determine if the current access token is valid (present and not expiring soon)
  const hasValidAccessToken =
    !!accessToken &&
    !isTokenExpiredOrExpiringSoon(accessToken, REFRESH_THRESHOLD_SECONDS);

  let authenticatedToken: string | null = hasValidAccessToken
    ? accessToken
    : null;

  // Attempt a proactive refresh if the token is absent or expiring soon
  if (!authenticatedToken && refreshToken) {
    const newToken = await refreshAccessToken(refreshToken);
    if (newToken) {
      authenticatedToken = newToken;
    }
  }

  const isAuthenticated = !!authenticatedToken;

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.next();

  // Attach the refreshed token as a new cookie when we obtained one
  if (authenticatedToken && authenticatedToken !== accessToken) {
    response.cookies.set(
      "access_token",
      authenticatedToken,
      accessTokenCookieOptions(),
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
