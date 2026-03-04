"use client";

import { useActionState, useRef } from "react";
import Button from "~/app/components/ui/Button";
import FormCard from "~/app/components/ui/FormCard";
import FormField from "~/app/components/ui/FormField";
import { register } from "./actions";

export default function Register() {
  const [state, action] = useActionState(register, {
    error: null,
    errors: null,
    fields: {},
  });
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  function validatePasswords() {
    const confirm = confirmRef.current;
    const password = passwordRef.current;
    if (!confirm || !password) return;
    if (confirm.value !== password.value) {
      confirm.setCustomValidity("Passwords do not match.");
    } else {
      confirm.setCustomValidity("");
    }
  }

  const fieldErrors: Record<string, string[]> = {};
  if (state.errors) {
    for (const errorObj of state.errors) {
      for (const [field, messages] of Object.entries(errorObj)) {
        fieldErrors[field] = [...(fieldErrors[field] ?? []), ...messages];
      }
    }
  }

  return (
    <FormCard title="Create Account" action={action}>
      {state.error && <p className="text-destructive text-md">{state.error}</p>}
      <FormField
        id="name"
        label="Name"
        type="text"
        required
        defaultValue={state.fields.name}
        errors={fieldErrors.name}
      />
      <FormField
        id="email"
        label="Email address"
        type="email"
        required
        defaultValue={state.fields.email}
        errors={fieldErrors.email}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        required
        ref={passwordRef}
        onChange={validatePasswords}
        defaultValue={state.fields.password}
        errors={fieldErrors.password}
      />
      <FormField
        id="confirm"
        label="Confirm password"
        type="password"
        required
        ref={confirmRef}
        onChange={validatePasswords}
        defaultValue={state.fields.confirm}
        errors={fieldErrors.confirm}
      />
      <Button type="submit">Create Account</Button>
    </FormCard>
  );
}
