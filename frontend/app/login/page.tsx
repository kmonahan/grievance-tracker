"use client";

import { useActionState } from "react";
import Button from "~/app/components/ui/Button";
import FormCard from "~/app/components/ui/FormCard";
import FormField from "~/app/components/ui/FormField";
import { login } from "./actions";

export default function Login() {
  const [state, action] = useActionState(login, { error: null });

  return (
    <FormCard title="Log In" action={action}>
      <FormField id="email" label="Email address" type="email" required />
      <FormField id="password" label="Password" type="password" required />
      {state.error && <p className="text-destructive text-md">{state.error}</p>}
      <Button type="submit">Log In</Button>
    </FormCard>
  );
}
