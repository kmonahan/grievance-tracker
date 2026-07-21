import { StatusTag } from "~/app/components/StatusTag";
import GrievanceUiCard from "~/app/components/ui/GrievanceCard";
import type { Grievance } from "~/app/grievances/types";
import { isValidStatus, STATUS_COLORS } from "~/app/status";
import { formatDate } from "~/lib/format";

const CATEGORY_COLORS: Record<string, string> = {
  "Health & Safety": "bg-red-500/10 text-red-700 border-red-200",
  PTO: "bg-yellow-500/10 text-yellow-800 border-yellow-200",
  Pay: "bg-yellow-500/10 text-yellow-800 border-yellow-200",
  "Scheduling & Overtime": "bg-purple-500/10 text-purple-800 border-purple-200",
  "Failure to Bargain": "bg-orange-500/10 text-orange-800 border-orange-200",
  "Union Busting": "bg-teal-500/10 text-teal-800 border-teal-200",
};

function getCategoryClasses(category: string): string {
  return (
    CATEGORY_COLORS[category] ??
    "bg-neutral-100 text-neutral-700 border-neutral-200"
  );
}

export function GrievanceCard({
  grievance,
  muted = false,
}: {
  grievance: Grievance;
  muted?: boolean;
}) {
  const latestEscalation = grievance.escalations.at(-1);

  return (
    <GrievanceUiCard
      id={grievance.id}
      name={grievance.name}
      status={
        latestEscalation && <StatusTag status={latestEscalation.status} />
      }
      pointPerson={grievance.point_person}
      date={
        latestEscalation &&
        (latestEscalation.date_due ? (
          <div className="font-subtitle text-base font-semibold text-highlight">
            {formatDate(latestEscalation.date_due)}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">No deadline</span>
        ))
      }
      footer={
        <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-4">
          <span
            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-sm font-medium ${getCategoryClasses(grievance.category)}`}
          >
            {grievance.category}
          </span>
          {latestEscalation?.step && (
            <span className="text-sm text-muted-foreground">
              {latestEscalation.step}
            </span>
          )}
        </div>
      }
      borderColors={
        latestEscalation && isValidStatus(latestEscalation.status)
          ? STATUS_COLORS[latestEscalation.status]
          : undefined
      }
      isMuted={muted}
    />
  );
}
