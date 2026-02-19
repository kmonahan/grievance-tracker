"use server";

export type LoginState = { error: string | null };

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const response = await fetch(`${process.env.BACKEND_URL}/users/login`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json();
    return { error: data.error ?? "An error occurred. Please try again." };
  }

  return { error: null };
}
