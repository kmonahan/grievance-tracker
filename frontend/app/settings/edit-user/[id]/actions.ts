"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type EditUserState = {
  error: string | null;
  errors: Record<string, string[]>[] | null;
  fields: Record<string, string>;
};

export async function editUser(
  id: number,
  _prevState: EditUserState,
  formData: FormData,
): Promise<EditUserState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const response = await fetch(`${process.env.BACKEND_URL}/users/edit/${id}`, {
    method: "PATCH",
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
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirm: formData.get("confirm") as string,
      },
    };
  }

  updateTag("users");
  redirect("/settings/users");
}
