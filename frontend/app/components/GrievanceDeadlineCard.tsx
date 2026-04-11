import Link from "next/link";
import type { Grievance } from "~/app/grievances/types";
import { formatDate } from "~/lib/format";

type GrievanceDeadlineCardProps = Grievance;

export default function GrievanceDeadlineCard({
  id,
  name,
  point_person,
  escalations,
}: GrievanceDeadlineCardProps) {
  const pointPersonInitials = point_person
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  const latestEscalation =
    escalations.length > 0 ? escalations[escalations.length - 1] : null;

  return (
    <Link href={`/grievances/${id}`}>
      <div className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-accent hover:shadow-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-subtitle font-semibold text-foreground">
                {name}
              </h3>
              {latestEscalation ? (
                <span className="inline-flex items-center rounded-md border border-transparent bg-accent px-2 py-0.5 text-sm font-medium text-accent-foreground">
                  {latestEscalation.status}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2 text-base">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-sm text-secondary-foreground">
                {pointPersonInitials}
              </span>
              <span className="text-muted-foreground">{point_person}</span>
            </div>
          </div>
          {latestEscalation?.date_due ? (
            <div className="sm:text-right">
              <div className="font-subtitle text-base font-semibold text-accent">
                {formatDate(latestEscalation.date_due)}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
