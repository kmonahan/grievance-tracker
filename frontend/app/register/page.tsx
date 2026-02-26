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

  return (
    <FormCard title="Create Account" action={action}>
      <FormField
        id="name"
        label="Name"
        type="text"
        required
        defaultValue={state.fields.name}
      />
      <FormField
        id="email"
        label="Email address"
        type="email"
        required
        defaultValue={state.fields.email}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        required
        ref={passwordRef}
        onChange={validatePasswords}
        defaultValue={state.fields.password}
      />
      <FormField
        id="confirm"
        label="Confirm password"
        type="password"
        required
        ref={confirmRef}
        onChange={validatePasswords}
        defaultValue={state.fields.confirm}
      />
      {state.error && <p className="text-destructive text-md">{state.error}</p>}
      {state.errors?.map((errorObj) =>
        Object.entries(errorObj).map(([field, messages]) =>
          messages.map((message) => (
            <p key={`${field}-${message}`} className="text-destructive text-md">
              {message}
            </p>
          )),
        ),
      )}
      <Button type="submit">Create Account</Button>
    </FormCard>
  );
}
