"use server";

import { updateTag } from "next/cache";
import { getAccessToken } from "~/app/lib/auth";

export async function editDeadlineMissed(
  escalationId: number,
  deadlineMissed: boolean,
): Promise<void> {
  const accessToken = await getAccessToken();

  const body = new FormData();
  body.append("deadline_missed", deadlineMissed ? "true" : "false");

  await fetch(`${process.env.BACKEND_URL}/escalations/edit/${escalationId}`, {
    method: "POST",
    body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  updateTag("grievances");
}
