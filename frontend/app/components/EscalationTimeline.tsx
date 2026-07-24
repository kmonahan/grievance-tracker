import TimelineCard from "~/app/components/TimelineCard";
import type { Escalation } from "~/app/grievances/types";
import { StatusDisplayToEnum } from "~/app/status";

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
          <TimelineCard
            id={esc.id}
            step={esc.step}
            user={esc.user}
            status={esc.status}
            date={esc.date}
            deadline_missed={!!(esc.date_due && esc.deadline_missed)}
            hearing_date={
              esc.status === StatusDisplayToEnum.SCHEDULED
                ? esc.date_due
                : undefined
            }
          />
        </li>
      ))}
    </ol>
  );
}
