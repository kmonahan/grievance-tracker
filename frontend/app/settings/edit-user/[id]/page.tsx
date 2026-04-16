import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import EditUserForm from "./EditUserForm";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const response = await fetch(`${process.env.BACKEND_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response?.ok) {
    notFound();
  }

  const user = await response.json();

  return <EditUserForm user={user} />;
}
