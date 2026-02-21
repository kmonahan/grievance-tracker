import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  const refreshToken = cookieStore.get("refresh_token");

  if (accessToken) {
    await fetch(`${process.env.BACKEND_URL}/users/logout`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken.value}` },
    });
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
  } else if (refreshToken) {
    cookieStore.delete("refresh_token");
  }

  redirect("/login");
}
