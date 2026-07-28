"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import FormField from "../../components/ui/FormField";
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
      <li className="rounded-lg border text-primary border-border bg-card p-4 relative">
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
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="hover focus font-semibold"
            >
              Cancel
            </button>
          </div>
          <div className="border-t border-dashed border-border pt-3 w-full">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Delete Holiday
            </p>
            <button
              type="button"
              onClick={handleDelete}
              className="button bg-destructive text-foreground focus"
            >
              Delete
            </button>
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
          className="font-subtitle text-base font-semibold text-primary hover focus inline-flex items-center gap-2 group"
        >
          Edit
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            role="presentation"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}
