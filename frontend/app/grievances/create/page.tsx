import { cookies } from "next/headers";
import Link from "next/link";
import Button from "~/app/components/ui/Button";
import FormCard from "~/app/components/ui/FormCard";
import FormField from "~/app/components/ui/FormField";
import FormSelect from "~/app/components/ui/FormSelect";

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

export default async function CreateGrievance({
  searchParams,
}: {
  searchParams: Promise<{ selectedCategory?: string }>;
}) {
  const { selectedCategory } = await searchParams;
  const categories = await getCategories();

  return (
    <FormCard title="Create New Grievance">
      <input type="hidden" name="user_id" value="" />
      <FormField id="name" label="Name" required maxLength={255} />
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="flex items-center gap-2 text-sm leading-none font-medium select-none font-subtitle"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive resize-none"
        />
      </div>
      <FormSelect
        id="category"
        label="Category"
        defaultValue={selectedCategory}
      >
        <option></option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </FormSelect>
      <Link
        href="/categories/add"
        className="inline-flex items-center text-sm font-medium text-secondary hover:underline font-subtitle"
      >
        + Add Category
      </Link>
      <FormSelect id="point_person" label="Point Person">
        <option></option>
        {POINT_PERSONS.map((person) => (
          <option key={person} value={person}>
            {person}
          </option>
        ))}
      </FormSelect>
      <Button type="submit">Submit</Button>
    </FormCard>
  );
}
