import { StatusTag } from "~/app/components/StatusTag";
import GrievanceCard from "~/app/components/ui/GrievanceCard";
import type { User } from "~/app/grievances/types";
import { formatDate } from "~/lib/format";
import { isValidStatus, STATUS_COLORS } from "../status";

interface TimelineCardProps {
  id: number;
  step: string;
  user: User;
  status: string;
  date: string;
  deadline_missed?: boolean;
  hearing_date?: string | null;
}

export default function TimelineCard({
  step,
  user,
  status,
  date,
  id,
  deadline_missed,
  hearing_date,
}: TimelineCardProps) {
  return (
    <GrievanceCard
      id={id}
      name={step}
      date={
        <span className="text-sm text-muted-foreground sm:whitespace-nowrap">
          {formatDate(date)}
        </span>
      }
      pointPerson={user.name}
      footer={
        <div className="flex items-center gap-2 text-base mt-2">
          <span className="inline-flex items-center rounded-md border border-transparent px-2 py-0.5 text-sm font-medium">
            Moved to
          </span>
          <StatusTag status={status} />
          {deadline_missed && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-highlight px-1.5 py-0.5 text-sm font-medium text-neutral-0">
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
          {hearing_date && (
            <span className="text-sm font-medium">
              Hearing: {formatDate(hearing_date)}
            </span>
          )}
        </div>
      }
      borderColors={isValidStatus(status) ? STATUS_COLORS[status] : undefined}
      noLink={true}
    />
  );
}
