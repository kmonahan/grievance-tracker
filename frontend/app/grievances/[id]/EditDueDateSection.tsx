"use client";

import { useActionState, useEffect, useState } from "react";
import { editDueDate } from "~/app/grievances/editDueDateAction";
import { formatDate } from "~/lib/format";

export function EditDueDateSection({
  escalationId,
  initialDateDue,
}: {
  escalationId: number;
  initialDateDue: string;
}) {
  const [state, formAction, isPending] = useActionState(editDueDate, {
    error: null,
    updatedDate: null,
  });
  const [editing, setEditing] = useState(false);
  const [currentDate, setCurrentDate] = useState(initialDateDue);

  useEffect(() => {
    if (state.updatedDate) {
      setCurrentDate(state.updatedDate);
      setEditing(false);
    }
  }, [state.updatedDate]);

  return (
    <div>
      <dt className="font-subtitle text-base font-semibold text-teal-600">
        Upcoming Due Date
      </dt>
      {editing ? (
        <dd className="mt-1">
          <form action={formAction}>
            <input
              type="hidden"
              name="escalation_id"
              value={escalationId.toString()}
            />
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="date-due" className="sr-only">
                New due date
              </label>
              <input
                id="date-due"
                name="date_due"
                type="date"
                defaultValue={currentDate}
                required
                className="rounded-md border border-border bg-card px-3 py-1.5 text-base text-foreground shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md bg-primary px-3 py-1.5 font-subtitle text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-md px-3 py-1.5 font-subtitle text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
            {state.error && (
              <p className="mt-1 text-sm text-red-600">{state.error}</p>
            )}
          </form>
        </dd>
      ) : (
        <dd className="mt-1 flex items-center gap-2">
          <span className="font-semibold text-accent">
            {formatDate(currentDate)}
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="font-subtitle text-sm font-medium text-secondary hover:underline"
          >
            Edit
          </button>
        </dd>
      )}
    </div>
  );
}
