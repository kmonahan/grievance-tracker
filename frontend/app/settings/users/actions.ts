"use server";

import { getAccessToken } from "~/app/lib/auth";

export async function toggleUserStatus(
  userId: number,
  isActive: boolean,
): Promise<{ ok: boolean }> {
  const token = await getAccessToken();
  const action = isActive ? "deactivate" : "reactivate";
  const response = await fetch(
    `${process.env.BACKEND_URL}/users/${action}/${userId}`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return { ok: response.ok };
}
