import { StatusTag } from "~/app/components/StatusTag";
import GrievanceCard from "~/app/components/ui/GrievanceCard";
import type { Grievance } from "~/app/grievances/types";
import { formatDate } from "~/lib/format";

type GrievanceDeadlineCardProps = Grievance;

export default function GrievanceDeadlineCard({
  id,
  name,
  point_person,
  escalations,
}: GrievanceDeadlineCardProps) {
  const latestEscalation =
    escalations.length > 0 ? escalations[escalations.length - 1] : null;

  return (
    <GrievanceCard
      id={id}
      name={name}
      status={
        latestEscalation ? <StatusTag status={latestEscalation.status} /> : null
      }
      pointPerson={point_person}
      date={
        latestEscalation?.date_due ? (
          <div className="font-subtitle text-base font-semibold text-highlight">
            {formatDate(latestEscalation.date_due)}
          </div>
        ) : null
      }
    />
  );
}
