"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { addCategory } from "~/app/categories/actions";
import Button from "~/app/components/ui/Button";
import FormField from "~/app/components/ui/FormField";

export default function AddCategoryForm() {
  const router = useRouter();
  const [state, action] = useActionState(addCategory, {
    error: null,
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      router.back();
    }
  }, [state.success, router]);

  return (
    <form className="space-y-5" action={action}>
      <FormField id="name" label="Name" required maxLength={255} />
      {state.error && <p className="text-destructive text-md">{state.error}</p>}
      <Button type="submit">Submit</Button>
    </form>
  );
}
