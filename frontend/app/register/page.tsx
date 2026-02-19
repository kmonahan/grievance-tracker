"use client";

import { useRef } from "react";
import Button from "~/app/components/ui/Button";
import FormCard from "~/app/components/ui/FormCard";
import FormField from "~/app/components/ui/FormField";

export default function Register() {
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
    <FormCard title="Create Account">
      <FormField id="name" label="Name" type="text" required />
      <FormField id="email" label="Email address" type="email" required />
      <FormField
        id="password"
        label="Password"
        type="password"
        required
        ref={passwordRef}
        onChange={validatePasswords}
      />
      <FormField
        id="confirm"
        label="Confirm password"
        type="password"
        required
        ref={confirmRef}
        onChange={validatePasswords}
      />
      <Button type="submit">Create Account</Button>
    </FormCard>
  );
}
