"use client";

import { useActionState, useEffect, useState } from "react";
import FormSelect from "../../components/FormSelect";
import Button from "../../components/ui/Button";
import FormField from "../../components/ui/FormField";
import type { StageState } from "./actions";
import { editStage } from "./actions";

export type Stage = {
  step: string;
  status: string;
  num_days: number | null;
  day_type: number | null;
};

const DAY_TYPE_LABELS: Record<number, string> = {
  1: "Working",
  2: "Calendar",
};

const initialState: StageState = { error: null, errors: null, fields: {} };

export default function StageRow({
  stage,
}: {
  stage: Stage;
}): React.ReactElement {
  const [editing, setEditing] = useState(false);
  const [state, action] = useActionState(
    editStage.bind(null, stage.step, stage.status),
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      setEditing(false);
    }
  }, [state.success]);

  if (editing) {
    return (
      <li className="rounded-lg border text-primary border-border bg-card p-4 relative">
        <form action={action} className="space-y-4">
          <p className="font-subtitle font-semibold text-primary">
            {stage.step} &ndash; {stage.status}
          </p>
          {state.error && (
            <p className="text-destructive text-lg">{state.error}</p>
          )}
          <input type="hidden" name="step" value={stage.step} />
          <input type="hidden" name="status" value={stage.status} />
          <FormField
            id="num_days"
            label="Number of Days"
            type="number"
            min={0}
            defaultValue={
              state.fields.num_days ?? stage.num_days?.toString() ?? ""
            }
            errors={state.errors?.num_days}
          />
          <FormSelect
            id="day_type"
            label="Day Type"
            defaultValue={
              state.fields.day_type ?? stage.day_type?.toString() ?? ""
            }
            errors={state.errors?.day_type}
          >
            <option value="">None</option>
            <option value="1">Working</option>
            <option value="2">Calendar</option>
          </FormSelect>
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
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border-2 border-border bg-card px-5 py-4 shadow-sm">
      <div className="min-w-0">
        <p className="font-subtitle font-semibold text-primary">
          {stage.step} &ndash; {stage.status}
        </p>
        <p className="text-sm text-muted-foreground">
          {stage.num_days !== null
            ? `${stage.num_days} ${stage.day_type !== null ? DAY_TYPE_LABELS[stage.day_type] : ""} day${stage.num_days === 1 ? "" : "s"}`
            : "No due date"}
        </p>
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
