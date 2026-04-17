"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import Button from "~/app/components/ui/Button";
import FormField from "~/app/components/ui/FormField";
import type { HolidayState } from "./actions";
import { deleteHoliday, editHoliday } from "./actions";

export type Holiday = {
  id: number;
  name: string;
  date: string;
};

const initialState: HolidayState = { error: null, errors: null, fields: {} };

export default function HolidayRow({
  holiday,
}: {
  holiday: Holiday;
}): React.ReactElement {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [state, action] = useActionState(
    editHoliday.bind(null, holiday.id),
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      setEditing(false);
    }
  }, [state.success]);

  async function handleDelete() {
    const result = await deleteHoliday(holiday.id);
    if (result.ok) {
      router.refresh();
    }
  }

  if (editing) {
    return (
      <li className="rounded-xl border-2 border-border bg-card px-5 py-4 shadow-sm space-y-4">
        <form action={action} className="space-y-4">
          {state.error && (
            <p className="text-destructive text-lg">{state.error}</p>
          )}
          <FormField
            id="name"
            label="Name"
            type="text"
            required
            defaultValue={state.fields.name ?? holiday.name}
          />
          <FormField
            id="date"
            label="Date"
            type="date"
            required
            defaultValue={state.fields.date ?? holiday.date}
          />
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-transparent border-2 border-border text-foreground hover:bg-card shadow-none hover:shadow-none"
            >
              Cancel
            </Button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border-2 border-border bg-card px-5 py-4 shadow-sm">
      <div className="min-w-0">
        <p className="font-subtitle font-semibold text-primary">
          {holiday.name}
        </p>
        <p className="text-sm text-muted-foreground">{holiday.date}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex items-center justify-center rounded-md px-3 py-1 font-subtitle text-base border-2 border-border hover:bg-card"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center justify-center rounded-md px-3 py-1 font-subtitle text-base border-2 border-destructive text-destructive hover:bg-destructive/10"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
