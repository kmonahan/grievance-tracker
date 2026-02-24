"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export type AddCategoryState = { error: string | null; success: boolean };

export async function addCategory(
  _prevState: AddCategoryState,
  formData: FormData,
): Promise<AddCategoryState> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await fetch(`${process.env.BACKEND_URL}/categories/add`, {
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
      success: false,
    };
  }

  revalidateTag("categories");
  return { error: null, success: true };
}
