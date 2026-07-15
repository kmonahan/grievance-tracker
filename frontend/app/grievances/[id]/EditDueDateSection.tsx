"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { editDeadlineMissed } from "~/app/grievances/deadlineMissedAction";
import { editDueDate } from "~/app/grievances/editDueDateAction";
import { formatDate } from "~/lib/format";

export function EditDueDateSection({
  escalationId,
  initialDateDue,
  initialDeadlineMissed,
}: {
  escalationId: number;
  initialDateDue: string | null;
  initialDeadlineMissed: boolean;
}) {
  const [state, formAction, isPending] = useActionState(editDueDate, {
    error: null,
    updatedDate: null,
  });
  const [editing, setEditing] = useState(false);
  const [currentDate, setCurrentDate] = useState(initialDateDue);
  const [deadlineMissed, setDeadlineMissed] = useState(initialDeadlineMissed);
  const [isDeadlinePending, startDeadlineTransition] = useTransition();

  useEffect(() => {
    if (state.updatedDate) {
      setCurrentDate(state.updatedDate);
      setEditing(false);
    }
  }, [state.updatedDate]);

  function handleDeadlineMissedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setDeadlineMissed(checked);
    if (editing) return;
    startDeadlineTransition(async () => {
      const error = await editDeadlineMissed(escalationId, checked);
      if (error) setDeadlineMissed(!checked);
    });
  }

  return (
    <>
      <div>
        <label className="flex items-center gap-2 text-base">
          <input
            type="checkbox"
            checked={deadlineMissed}
            onChange={handleDeadlineMissedChange}
            disabled={isDeadlinePending}
            className="h-4 w-4 rounded border-border text-purple-700 focus:ring-purple-700"
          />
          <span>Judah missed the deadline.</span>
        </label>
      </div>
      {currentDate && (
        <div>
          <dt className="font-subtitle text-base font-semibold text-purple-700">
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
                <input
                  type="hidden"
                  name="deadline_missed"
                  value={deadlineMissed ? "true" : "false"}
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
                    className="rounded-md border border-border bg-card px-3 py-1.5 text-base text-primary shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="rounded-md bg-primary px-3 py-1.5 font-subtitle text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 focus:border focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="rounded-md px-3 py-1.5 font-subtitle text-sm font-semibold text-muted-foreground transition-colors hover:text-hover focus:border focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
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
              <span className="font-semibold text-highlight">
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
      )}
    </>
  );
}
