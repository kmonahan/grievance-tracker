"use client";

import { useActionState, useEffect, useState } from "react";
import { addCategory } from "~/app/categories/actions";
import Button from "~/app/components/ui/Button";
import FormCard from "~/app/components/ui/FormCard";
import FormField from "~/app/components/ui/FormField";
import FormSelect from "~/app/components/ui/FormSelect";
import Modal from "~/app/components/ui/Modal";

type Category = {
  id: number;
  name: string;
};

export default function CreateGrievanceForm({
  categories: initialCategories,
  pointPersons,
}: {
  categories: Category[];
  pointPersons: string[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addCategoryState, addCategoryAction] = useActionState(addCategory, {
    error: null,
    success: false,
  });

  useEffect(() => {
    if (addCategoryState.success && addCategoryState.category) {
      const newCategory = addCategoryState.category;
      setCategories((prev) => [...prev, newCategory]);
      setSelectedCategory(String(newCategory.id));
      setIsModalOpen(false);
    }
  }, [addCategoryState.success, addCategoryState.category]);

  return (
    <>
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
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value=""></option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </FormSelect>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center text-sm font-medium text-secondary hover:underline font-subtitle"
        >
          + Add Category
        </button>
        <FormSelect id="point_person" label="Point Person">
          <option value=""></option>
          {pointPersons.map((person) => (
            <option key={person} value={person}>
              {person}
            </option>
          ))}
        </FormSelect>
        <Button type="submit">Submit</Button>
      </FormCard>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-6 py-6">
          <div className="px-6 pb-6 space-y-1">
            <h2 className="font-semibold font-subtitle text-2xl text-center">
              Add Category
            </h2>
          </div>
          <div className="px-6">
            <form className="space-y-5" action={addCategoryAction}>
              <FormField
                id="category-name"
                name="name"
                label="Category Name"
                required
                maxLength={255}
              />
              {addCategoryState.error && (
                <p className="text-destructive text-md">
                  {addCategoryState.error}
                </p>
              )}
              <Button type="submit">Submit</Button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}
