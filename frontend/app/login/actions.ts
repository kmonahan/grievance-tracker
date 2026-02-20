"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = { error: string | null };

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const response = await fetch(`${process.env.BACKEND_URL}/users/login`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json();
    return { error: data.error ?? "An error occurred. Please try again." };
  }

  const data = await response.json();
  const isProduction = process.env.NODE_ENV === "production";
  const now = Date.now();
  const cookieStore = await cookies();
  cookieStore.set("access_token", data.access_token, {
    httpOnly: true,
    secure: isProduction,
    path: "/",
    expires: new Date(now + 45 * 60 * 1000),
  });
  cookieStore.set("refresh_token", data.refresh_token, {
    httpOnly: true,
    secure: isProduction,
    path: "/",
    expires: new Date(now + 28 * 24 * 60 * 60 * 1000),
  });

  redirect("/");
}
