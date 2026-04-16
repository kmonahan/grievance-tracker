"use client";

import { useActionState } from "react";
import Button from "~/app/components/ui/Button";
import FormCard from "~/app/components/ui/FormCard";
import FormField from "~/app/components/ui/FormField";
import { editUser } from "./actions";

type User = { id: number; name: string; email: string; is_active: boolean };

export default function EditUserForm({ user }: { user: User }) {
  const [state, action] = useActionState(editUser.bind(null, user.id), {
    error: null,
    errors: null,
    fields: {},
  });

  const fieldErrors: Record<string, string[]> = {};
  if (state.errors) {
    for (const errorObj of state.errors) {
      for (const [field, messages] of Object.entries(errorObj)) {
        fieldErrors[field] = [...(fieldErrors[field] ?? []), ...messages];
      }
    }
  }

  return (
    <FormCard title="Edit Account" action={action}>
      {state.error && <p className="text-destructive text-lg">{state.error}</p>}
      <FormField
        id="name"
        label="Name"
        type="text"
        required
        defaultValue={state.fields.name ?? user.name}
        errors={fieldErrors.name}
      />
      <FormField
        id="email"
        label="Email address"
        type="email"
        required
        defaultValue={state.fields.email ?? user.email}
        errors={fieldErrors.email}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        defaultValue={state.fields.password}
        errors={fieldErrors.password}
      />
      <FormField
        id="confirm"
        label="Confirm password"
        type="password"
        defaultValue={state.fields.confirm}
        errors={fieldErrors.confirm}
      />
      <Button type="submit">Save Changes</Button>
    </FormCard>
  );
}
