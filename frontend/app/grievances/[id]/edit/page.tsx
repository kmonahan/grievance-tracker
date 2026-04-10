import { notFound } from "next/navigation";
import CreateGrievanceForm from "~/app/components/CreateGrievanceForm";
import { editGrievance } from "~/app/grievances/actions";
import type { Category, PointPerson } from "~/app/grievances/create/page";
import type { Grievance } from "~/app/grievances/types";
import { getAccessToken } from "~/app/lib/auth";

async function getCategories(
  accessToken: string | undefined,
): Promise<Category[]> {
  const response = await fetch(`${process.env.BACKEND_URL}/categories`, {
    next: { tags: ["categories"] },
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
  if (!response.ok) return [];
  const data = (await response.json()) as { categories: Category[] };
  return data.categories;
}

async function getPointPersons(
  accessToken: string | undefined,
): Promise<PointPerson[] | null> {
  const response = await fetch(`${process.env.BACKEND_URL}/users/active`, {
    next: { tags: ["users"] },
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { users: PointPerson[] };
  return data.users;
}

async function getCurrentUser(
  accessToken: string | undefined,
): Promise<PointPerson | null> {
  const response = await fetch(`${process.env.BACKEND_URL}/users/me`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
  if (!response.ok) return null;
  return (await response.json()) as PointPerson;
}

export default async function EditGrievancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accessToken = await getAccessToken();

  const [grievanceResponse, categories, pointPersons, currentUser] =
    await Promise.all([
      fetch(`${process.env.BACKEND_URL}/grievances/${id}`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      }),
      getCategories(accessToken),
      getPointPersons(accessToken),
      getCurrentUser(accessToken),
    ]);

  if (!grievanceResponse.ok) {
    notFound();
  }

  const grievance: Grievance = await grievanceResponse.json();

  const matchedCategory = categories.find(
    (cat) => cat.name === grievance.category,
  );
  const matchedPointPerson = pointPersons?.find(
    (p) => p.name === grievance.point_person,
  );

  const boundEditGrievance = editGrievance.bind(null, id);

  return (
    <CreateGrievanceForm
      categories={categories}
      pointPersons={pointPersons ?? []}
      pointPersonsError={
        pointPersons === null ? "Failed to load user list." : null
      }
      userId={currentUser?.id ?? 0}
      formAction={boundEditGrievance}
      initialValues={{
        name: grievance.name,
        description: grievance.description,
        category_id: matchedCategory ? String(matchedCategory.id) : "",
        point_person_id: matchedPointPerson
          ? String(matchedPointPerson.id)
          : "",
      }}
      cancelHref={`/grievances/${id}`}
      title="Edit Grievance"
    />
  );
}
