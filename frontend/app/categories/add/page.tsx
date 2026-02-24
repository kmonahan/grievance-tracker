import AddCategoryForm from "~/app/components/AddCategoryForm";

export default function AddCategoryPage() {
  return (
    <main className="w-full mx-auto px-6 py-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mt-8 bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 border-2 shadow-xl">
          <div className="px-6 pb-6 space-y-1">
            <h1 className="font-semibold font-subtitle text-2xl text-center">
              Add Category
            </h1>
          </div>
          <div className="px-6">
            <AddCategoryForm />
          </div>
        </div>
      </div>
    </main>
  );
}
