"use server";

import { updateTag } from "next/cache";
import { getAccessToken } from "~/app/lib/auth";

export async function editDeadlineMissed(
  escalationId: number,
  deadlineMissed: boolean,
): Promise<string | null> {
  const accessToken = await getAccessToken();

  const body = new FormData();
  body.append("deadline_missed", deadlineMissed ? "true" : "false");

  const response = await fetch(
    `${process.env.BACKEND_URL}/escalations/edit/${escalationId}`,
    {
      method: "POST",
      body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    return data.error ?? "An error occurred. Please try again.";
  }

  updateTag("grievances");
  return null;
}
