"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import Button from "~/app/components/ui/Button";
import FormField from "~/app/components/ui/FormField";
import type { HolidayState } from "./actions";
import { createHoliday } from "./actions";

const initialState: HolidayState = { error: null, errors: null, fields: {} };

export default function AddHolidayButton(): React.ReactElement {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createHoliday, initialState);

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state.success, router]);

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        Add holiday
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="space-y-4 rounded-xl border-2 border-border bg-card px-5 py-4 shadow-sm"
    >
      {state.error && <p className="text-destructive text-lg">{state.error}</p>}
      <FormField
        id="name"
        label="Name"
        type="text"
        required
        defaultValue={state.fields.name}
      />
      <FormField
        id="date"
        label="Date"
        type="date"
        required
        defaultValue={state.fields.date}
      />
      <Button type="submit">Save</Button>
    </form>
  );
}
