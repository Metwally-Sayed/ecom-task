import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

import type { AuthPayload } from "@/lib/types";

export const ACCESS_TOKEN_COOKIE = "mini_shop_access_token";
export const REFRESH_TOKEN_COOKIE = "mini_shop_refresh_token";

const accessTokenMaxAge = 60 * 60;
const refreshTokenMaxAge = 60 * 60 * 24 * 30;

const baseCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function setAuthCookies(
  cookies: ResponseCookies,
  payload: Pick<AuthPayload, "accessToken" | "refreshToken">,
) {
  cookies.set(ACCESS_TOKEN_COOKIE, payload.accessToken, {
    ...baseCookieOptions,
    maxAge: accessTokenMaxAge,
  });
  cookies.set(REFRESH_TOKEN_COOKIE, payload.refreshToken, {
    ...baseCookieOptions,
    maxAge: refreshTokenMaxAge,
  });
}

export function clearAuthCookies(cookies: ResponseCookies) {
  cookies.set(ACCESS_TOKEN_COOKIE, "", {
    ...baseCookieOptions,
    maxAge: 0,
  });
  cookies.set(REFRESH_TOKEN_COOKIE, "", {
    ...baseCookieOptions,
    maxAge: 0,
  });
}
