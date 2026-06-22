"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useState } from "react";
import { addCategory } from "~/app/categories/actions";
import Button from "~/app/components/ui/Button";
import FormCard from "~/app/components/ui/FormCard";
import FormField from "~/app/components/ui/FormField";
import FormSelect from "~/app/components/ui/FormSelect";
import Modal from "~/app/components/ui/Modal";
import { type AddGrievanceState, addGrievance } from "~/app/grievances/actions";
import { FILTER_STEPS } from "~/app/grievances/constants";
import { deleteGrievance } from "~/app/grievances/deleteAction";

type Category = {
  id: number;
  name: string;
};

type PointPerson = {
  id: number;
  name: string;
  isActive: boolean;
};

type GrievanceFormAction = (
  prevState: AddGrievanceState,
  formData: FormData,
) => Promise<AddGrievanceState>;

export default function CreateGrievanceForm({
  categories: initialCategories,
  pointPersons,
  defaultPointPersonId,
  pointPersonsError,
  userId,
  formAction = addGrievance,
  initialValues,
  cancelHref,
  title = "Create New Grievance",
  grievanceId,
}: {
  categories: Category[];
  pointPersons: PointPerson[];
  defaultPointPersonId?: number | null;
  pointPersonsError?: string | null;
  userId: number;
  formAction?: GrievanceFormAction;
  initialValues?: {
    name?: string;
    description?: string;
    category_id?: string;
    point_person_id?: string;
  };
  cancelHref?: string;
  title?: string;
  grievanceId?: string;
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState(
    initialValues?.category_id ?? "",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [grievanceState, grievanceAction] = useActionState<
    AddGrievanceState,
    FormData
  >(formAction, {
    error: null,
    errors: null,
    fields: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      point_person_id: initialValues?.point_person_id ?? "",
    },
  });

  const [addCategoryState, addCategoryAction] = useActionState(addCategory, {
    error: null,
    success: false,
  });

  const isDisabled = !!pointPersonsError;

  useEffect(() => {
    if (addCategoryState.success && addCategoryState.category) {
      const newCategory = addCategoryState.category;
      setCategories((prev) => [...prev, newCategory]);
      setSelectedCategory(String(newCategory.id));
      setIsModalOpen(false);
    }
  }, [addCategoryState.success, addCategoryState.category]);

  const fieldErrors = grievanceState.errors;

  return (
    <>
      <FormCard title={title} action={grievanceAction}>
        <input type="hidden" name="user_id" value={userId} />
        {pointPersonsError && <p>{pointPersonsError}</p>}
        {grievanceState.error &&
          grievanceState.fields &&
          Object.keys(grievanceState.fields).length > 0 && (
            <p className="text-destructive text-lg">{grievanceState.error}</p>
          )}
        <FormField
          id="name"
          label="Name"
          required
          maxLength={255}
          disabled={isDisabled}
          defaultValue={grievanceState.fields?.name ?? ""}
          errors={fieldErrors?.name}
        />
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="flex items-center gap-2 text-base leading-none font-medium select-none font-subtitle"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            disabled={isDisabled}
            defaultValue={grievanceState.fields?.description ?? ""}
            className="border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-lg shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive resize-none"
          />
          {fieldErrors?.description?.map((message) => (
            <p key={message} className="text-destructive text-lg">
              {message}
            </p>
          ))}
        </div>
        <FormSelect
          id="category_id"
          label="Category"
          value={grievanceState.fields?.category_id ?? selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          disabled={isDisabled}
          errors={fieldErrors?.category_id}
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
          className="inline-flex items-center text-base font-medium text-secondary hover:underline font-subtitle"
        >
          + Add Category
        </button>
        <FormSelect
          id="point_person_id"
          label="Point Person"
          defaultValue={
            grievanceState.fields?.point_person_id ??
            (defaultPointPersonId != null ? String(defaultPointPersonId) : "")
          }
          disabled={isDisabled}
          errors={fieldErrors?.point_person_id}
        >
          <option value=""></option>
          {pointPersons
            .filter((person) => person.id !== 1)
            .map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
        </FormSelect>
        {typeof grievanceId === "undefined" ? (
          <FormSelect
            id="step"
            label="Step"
            name="step"
            defaultValue={grievanceState.fields?.step ?? FILTER_STEPS[0].value}
            errors={fieldErrors?.step}
          >
            {FILTER_STEPS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </FormSelect>
        ) : null}
        <Button type="submit" disabled={isDisabled}>
          Submit
        </Button>
        {cancelHref && (
          <Link
            href={cancelHref}
            className="inline-flex items-center justify-center w-full h-11 rounded-md border border-input px-4 py-2 font-subtitle font-semibold text-lg text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </Link>
        )}
        {grievanceId && (
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center justify-center w-full h-11 rounded-md border border-destructive px-4 py-2 font-subtitle font-semibold text-lg text-destructive hover:bg-destructive/10 transition-colors"
          >
            Delete
          </button>
        )}
      </FormCard>
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="flex flex-col gap-6 py-6">
          <div className="px-6 pb-6 space-y-1">
            <h2 className="font-semibold font-subtitle text-3xl text-center">
              Delete Grievance
            </h2>
            <p className="text-center text-muted-foreground">
              Are you sure you want to delete this grievance? This action cannot
              be undone.
            </p>
            {deleteError && (
              <p className="text-destructive text-lg text-center">
                {deleteError}
              </p>
            )}
          </div>
          <div className="px-6 flex gap-4">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 h-11 rounded-md border border-input px-4 py-2 font-subtitle font-semibold text-lg text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!grievanceId) return;
                setDeleteError(null);
                startTransition(() => {
                  deleteGrievance(grievanceId).catch(() => {
                    setDeleteError("Failed to delete grievance.");
                  });
                });
              }}
              className="flex-1 h-11 rounded-md bg-destructive px-4 py-2 font-subtitle font-semibold text-lg text-neutral-0 hover:bg-destructive/90 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-6 py-6">
          <div className="px-6 pb-6 space-y-1">
            <h2 className="font-semibold font-subtitle text-3xl text-center">
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
                <p className="text-destructive text-lg">
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
