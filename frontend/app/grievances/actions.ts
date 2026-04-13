"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAccessToken } from "~/app/lib/auth";

export type AddGrievanceState = {
  error: string | null;
  errors: Record<string, string[]> | null;
  fields: Record<string, string>;
};

export async function addGrievance(
  _prevState: AddGrievanceState,
  formData: FormData,
): Promise<AddGrievanceState> {
  const accessToken = await getAccessToken();

  const response = await fetch(`${process.env.BACKEND_URL}/grievances/add`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    return {
      error: data.error ?? "An error occurred. Please try again.",
      errors: data.errors ?? null,
      fields: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        category_id: formData.get("category_id") as string,
        point_person_id: formData.get("point_person_id") as string,
      },
    };
  }

  const data = await response.json();
  updateTag("grievances");
  redirect(`/grievances/${data.id}`);
}

export async function editGrievance(
  id: string,
  _prevState: AddGrievanceState,
  formData: FormData,
): Promise<AddGrievanceState> {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${process.env.BACKEND_URL}/grievances/edit/${id}`,
    {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const data = await response.json();
    return {
      error: data.error ?? "An error occurred. Please try again.",
      errors: data.errors ?? null,
      fields: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        category_id: formData.get("category_id") as string,
        point_person_id: formData.get("point_person_id") as string,
      },
    };
  }

  updateTag("grievances");
  redirect(`/grievances/${id}`);
}
