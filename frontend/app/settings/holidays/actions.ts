"use server";

import { revalidatePath } from "next/cache";
import { getAccessToken } from "~/app/lib/auth";

export type HolidayState = {
  error: string | null;
  errors: Record<string, string[]>[] | null;
  fields: Record<string, string>;
  success?: boolean;
};

export async function createHoliday(
  _prevState: HolidayState,
  formData: FormData,
): Promise<HolidayState> {
  const token = await getAccessToken();

  const response = await fetch(`${process.env.BACKEND_URL}/holidays/create`, {
    method: "POST",
    body: formData,
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json();
    return {
      error: data.error ?? "An error occurred. Please try again.",
      errors: data.errors ?? null,
      fields: {
        name: formData.get("name") as string,
        date: formData.get("date") as string,
      },
    };
  }

  revalidatePath("/settings/holidays");
  return { error: null, errors: null, fields: {}, success: true };
}

export async function editHoliday(
  id: number,
  _prevState: HolidayState,
  formData: FormData,
): Promise<HolidayState> {
  const token = await getAccessToken();

  const response = await fetch(
    `${process.env.BACKEND_URL}/holidays/edit/${id}`,
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
        name: formData.get("name") as string,
        date: formData.get("date") as string,
      },
    };
  }

  revalidatePath("/settings/holidays");
  return { error: null, errors: null, fields: {}, success: true };
}

export async function deleteHoliday(id: number): Promise<{ ok: boolean }> {
  const token = await getAccessToken();

  const response = await fetch(
    `${process.env.BACKEND_URL}/holidays/delete/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (response.ok) {
    revalidatePath("/settings/holidays");
  }
  return { ok: response.ok };
}
