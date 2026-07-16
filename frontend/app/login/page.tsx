"use client";

import { useActionState } from "react";
import Button from "../components/Button";
import FormCard from "../components/FormCard";
import FormField from "../components/FormField";
import { login } from "./actions";

export default function Login() {
  const [state, action] = useActionState(login, { error: null });

  return (
    <FormCard title="Log In" action={action}>
      <FormField id="email" label="Email address" type="email" required />
      <FormField id="password" label="Password" type="password" required />
      {state.error && <p className="text-destructive text-lg">{state.error}</p>}
      <Button type="submit">Log In</Button>
    </FormCard>
  );
}
