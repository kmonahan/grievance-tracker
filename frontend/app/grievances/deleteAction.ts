"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAccessToken } from "~/app/lib/auth";

export async function deleteGrievance(id: string): Promise<void> {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${process.env.BACKEND_URL}/grievances/delete/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete grievance");
  }

  updateTag("grievances");
  redirect("/grievances");
}
