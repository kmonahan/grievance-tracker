"use server";

import { revalidatePath } from "next/cache";
import { getAccessToken } from "~/app/lib/auth";

export type StageState = {
  error: string | null;
  errors: Record<string, string[]> | null;
  fields: Record<string, string>;
  success?: boolean;
};

export async function editStage(
  step: string,
  status: string,
  _prevState: StageState,
  formData: FormData,
): Promise<StageState> {
  const token = await getAccessToken();

  const response = await fetch(
    `${process.env.BACKEND_URL}/stages/edit/${step}/${status}`,
    {
      method: "PATCH",
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    const data = await response.json();
    return {
      error: data.error ?? "An error occurred. Please try again.",
      errors: data.errors ?? null,
      fields: {
        num_days: formData.get("num_days") as string,
        day_type: formData.get("day_type") as string,
      },
    };
  }

  revalidatePath("/settings/stages");
  return { error: null, errors: null, fields: {}, success: true };
}
