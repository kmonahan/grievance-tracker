"use server";

export type EditUserState = {
  error: string | null;
  errors: Record<string, string[]>[] | null;
  fields: Record<string, string>;
};

export async function editUser(
  _prevState: EditUserState,
  _formData: FormData,
): Promise<EditUserState> {
  throw new Error("Not implemented");
}
