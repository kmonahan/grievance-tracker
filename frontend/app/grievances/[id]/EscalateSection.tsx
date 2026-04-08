"use client";

import { useState } from "react";

const ESCALATION_OPTIONS = [
  {
    status: "Scheduled",
    selectedClasses: "border-teal-500 bg-teal-500/10 ring-2 ring-teal-500/30",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5 text-teal-600"
      >
        <path
          fillRule="evenodd"
          d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    accentColor: "text-teal-600",
    badgeClasses: "bg-teal-500 text-teal-0",
  },
  {
    status: "In Abeyance",
    selectedClasses: "border-neutral-400 bg-neutral-50 ring-2 ring-neutral-300",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5 text-neutral-500"
      >
        <path
          fillRule="evenodd"
          d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm5-2.25A.75.75 0 0 1 7.75 7h.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-4.5Zm4 0a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-4.5Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    accentColor: "text-neutral-600",
    badgeClasses: "bg-neutral-50 text-neutral-800 border border-neutral-300",
  },
  {
    status: "Withdrawn",
    selectedClasses: "border-red-500 bg-red-50 ring-2 ring-red-400/30",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5 text-red-600"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    accentColor: "text-red-600",
    badgeClasses: "bg-red-500 text-neutral-0",
  },
  {
    status: "Resolved",
    selectedClasses: "border-teal-700 bg-teal-700/10 ring-2 ring-teal-700/30",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5 text-teal-700"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    accentColor: "text-teal-700",
    badgeClasses: "bg-teal-600 text-teal-0",
  },
];

export function EscalateSection() {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState("");

  return (
    <section className="border-t">
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between px-6 py-5 transition-colors hover:bg-muted/40"
      >
        <div className="flex items-center gap-2">
          <h2 className="font-subtitle text-xl font-semibold">Escalate</h2>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`size-5 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {expanded && (
        <div className="px-6 pb-6">
          <p className="mb-4 text-base">
            Escalate from{" "}
            <strong className="font-bold">Waiting to Schedule</strong> to a new
            status.
          </p>

          <fieldset>
            <legend className="sr-only">Select new status</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ESCALATION_OPTIONS.map((opt) => (
                <label
                  key={opt.status}
                  className={`flex items-center cursor-pointer gap-4 rounded-xl border-2 p-4 transition-all ${
                    selected === opt.status
                      ? opt.selectedClasses
                      : "border-border hover:border-muted-foreground/30 hover:bg-muted/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="escalation-status"
                    value={opt.status}
                    checked={selected === opt.status}
                    onChange={() => {
                      setSelected(opt.status);
                      if (opt.status !== "Scheduled") setDueDate("");
                    }}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center text-3xl`}
                    aria-hidden="true"
                  >
                    {opt.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-base font-medium ${opt.badgeClasses}`}
                      >
                        {opt.status}
                      </span>
                      {selected === opt.status && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="size-4 text-teal-600"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          {selected === "Scheduled" && (
            <div className="mt-4 rounded-lg border border-teal-200 bg-teal-500/5 p-4">
              <label
                htmlFor="due-date"
                className="font-subtitle text-sm font-semibold text-teal-600"
              >
                Due Date
              </label>
              <p className="text-xs text-muted-foreground">
                The deadline for the scheduled hearing.
              </p>
              <input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-base text-foreground shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 sm:max-w-xs"
              />
            </div>
          )}

          {selected && (
            <div className="mt-5 flex items-center gap-3">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 font-subtitle text-base font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={selected === "Scheduled" && !dueDate}
              >
                Submit Escalation
              </button>
              <button
                onClick={() => {
                  setSelected(null);
                  setDueDate("");
                }}
                className="rounded-md px-4 py-2.5 font-subtitle text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
