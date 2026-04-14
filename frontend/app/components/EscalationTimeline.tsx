import { StatusTag } from "~/app/components/StatusTag";
import type { Escalation } from "~/app/grievances/types";
import { formatDate, getInitials } from "~/lib/format";

export function EscalationTimeline({
  escalations,
}: {
  escalations: Escalation[];
}) {
  const reversed = [...escalations].reverse();

  return (
    <ol className="relative ml-4 border-l-2 border-border">
      {reversed.map((esc) => (
        <li key={esc.id} className="relative mb-8 ml-6 last:mb-0">
          <span className="absolute -left-8 flex h-4 w-4 items-center justify-center rounded-full border-2 border-border bg-card" />
          <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
            <div className="mb-2">
              <time className="block text-sm text-teal-600 sm:text-base">
                {formatDate(esc.date)}
              </time>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="font-subtitle text-base font-semibold">
                  {esc.step}
                </span>
                <StatusTag status={esc.status} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-teal-700">
              {esc.hearing_date && (
                <span>Hearing: {formatDate(esc.hearing_date)}</span>
              )}
              {esc.date_due && (
                <span className="flex items-center gap-2">
                  <span>Due: {formatDate(esc.date_due)}</span>
                  {esc.deadline_missed && (
                    <span className="inline-flex items-center gap-1 rounded-sm bg-red-600 px-1.5 py-0.5 text-sm font-medium text-neutral-0">
                      <svg
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                          fillRule="evenodd"
                        />
                      </svg>
                      Deadline missed
                    </span>
                  )}
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-[10px] text-secondary-foreground">
                  {getInitials(esc.user.name)}
                </span>
                {esc.user.name}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
