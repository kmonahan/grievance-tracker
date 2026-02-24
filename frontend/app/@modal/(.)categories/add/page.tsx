import AddCategoryForm from "~/app/components/AddCategoryForm";
import Modal from "~/app/components/ui/Modal";

export default function AddCategoryModal() {
  return (
    <Modal>
      <div className="flex flex-col gap-6 py-6">
        <div className="px-6 pb-6 space-y-1">
          <h2 className="font-semibold font-subtitle text-2xl text-center">
            Add Category
          </h2>
        </div>
        <div className="px-6">
          <AddCategoryForm />
        </div>
      </div>
    </Modal>
  );
}
