import { cookies } from "next/headers";
import CreateGrievanceForm from "~/app/components/CreateGrievanceForm";

export type Category = {
  id: number;
  name: string;
};

export type PointPerson = {
  id: number;
  name: string;
  isActive: boolean;
};

async function getCategories(): Promise<Category[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const response = await fetch(`${process.env.BACKEND_URL}/categories`, {
    next: { tags: ["categories"] },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) return [];
  const data = (await response.json()) as { categories: Category[] };
  return data.categories;
}

async function getPointPersons(): Promise<PointPerson[] | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const response = await fetch(`${process.env.BACKEND_URL}/users/active`, {
    next: { tags: ["users"] },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { users: PointPerson[] };
  return data.users;
}

async function getCurrentUser(): Promise<PointPerson | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const response = await fetch(`${process.env.BACKEND_URL}/users/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) return null;
  return (await response.json()) as PointPerson;
}

export default async function CreateGrievance() {
  const [categories, pointPersons, currentUser] = await Promise.all([
    getCategories(),
    getPointPersons(),
    getCurrentUser(),
  ]);

  return (
    <CreateGrievanceForm
      categories={categories}
      pointPersons={pointPersons ?? []}
      defaultPointPersonId={currentUser?.id ?? null}
      pointPersonsError={
        pointPersons === null ? "Failed to load user list." : null
      }
    />
  );
}
