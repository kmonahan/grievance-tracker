import { cookies } from "next/headers";
import CreateGrievanceForm from "~/app/components/CreateGrievanceForm";

type Category = {
  id: number;
  name: string;
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

const POINT_PERSONS = ["Walter Reuther", "Cesar Chavez", "Clara Lemlich"];

export default async function CreateGrievance() {
  const categories = await getCategories();

  return (
    <CreateGrievanceForm categories={categories} pointPersons={POINT_PERSONS} />
  );
}
