"use client";

import { useRouter } from "next/navigation";
import Button from "~/app/components/ui/Button";
import FormField from "~/app/components/ui/FormField";

export default function AddCategoryForm() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.back();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <FormField id="name" label="Name" required maxLength={255} />
      <Button type="submit">Submit</Button>
    </form>
  );
}
