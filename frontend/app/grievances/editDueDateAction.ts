"use server";

import { updateTag } from "next/cache";
import { getAccessToken } from "~/app/lib/auth";

export type EditDueDateState = {
  error: string | null;
  updatedDate: string | null;
};

export async function editDueDate(
  _prevState: EditDueDateState,
  formData: FormData,
): Promise<EditDueDateState> {
  const accessToken = await getAccessToken();
  const escalationId = formData.get("escalation_id") as string;
  const dateDue = formData.get("date_due") as string;

  const body = new FormData();
  body.append("date_due", dateDue);

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
    return {
      error: data.error ?? "An error occurred. Please try again.",
      updatedDate: null,
    };
  }

  updateTag("grievances");
  return { error: null, updatedDate: dateDue };
}
