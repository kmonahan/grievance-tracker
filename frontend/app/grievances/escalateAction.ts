"use server";

import { updateTag } from "next/cache";
import { getAccessToken } from "~/app/lib/auth";
import { decodeJwtPayload } from "~/app/lib/jwt";

export type EscalateGrievanceState = {
  error: string | null;
};

export async function escalateGrievance(
  _prevState: EscalateGrievanceState,
  formData: FormData,
): Promise<EscalateGrievanceState> {
  const accessToken = await getAccessToken();

  const payload = accessToken ? decodeJwtPayload(accessToken) : null;
  const userId = payload?.sub ? Number(payload.sub) : null;

  const grievanceId = formData.get("grievance_id") as string;
  const step = formData.get("step") as string;
  const status = formData.get("status") as string;
  const hearingDate = formData.get("hearing_date") as string | null;

  const body: Record<string, unknown> = {
    step,
    status,
    user_id: userId,
  };

  if (hearingDate) {
    body.hearing_date = hearingDate;
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/grievances/escalate/${grievanceId}`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const data = await response.json();
    return {
      error: data.error ?? "An error occurred. Please try again.",
    };
  }

  updateTag("grievances");
  return { error: null };
}
