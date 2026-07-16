import GrievanceCard from "~/app/components/ui/GrievanceCard";
import type { RecentActivity } from "~/app/page";
import { formatDate } from "~/lib/format";

export default function RecentActivityCard({
  grievance,
  user,
  status,
  date,
  grievance_id,
}: RecentActivity) {
  return (
    <GrievanceCard
      id={grievance_id}
      name={grievance}
      date={
        <span className="text-sm text-muted-foreground sm:whitespace-nowrap">
          {formatDate(date)}
        </span>
      }
      pointPerson={user.name}
      footer={
        <div className="flex items-center gap-2 text-base mt-2">
          <span className="inline-flex items-center rounded-md border border-transparent px-2 py-0.5 text-sm font-medium text-white">
            Moved to
          </span>
          <span className="inline-flex items-center rounded-md border border-tertiary px-2 py-0.5 text-sm font-medium text-primary">
            {status}
          </span>
        </div>
      }
    />
  );
}
