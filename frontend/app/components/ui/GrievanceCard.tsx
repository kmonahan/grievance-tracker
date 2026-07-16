import Link from "next/link";
import type { JSX, ReactNode } from "react";
import PointPerson from "~/app/components/PointPerson";

export interface GrievanceCardProps {
  id: number;
  name: string;
  status?: ReactNode;
  pointPerson?: string;
  date?: ReactNode;
  footer?: ReactNode;
}

export default function GrievanceCard({
  id,
  name,
  status,
  pointPerson,
  date,
  footer,
}: GrievanceCardProps): JSX.Element {
  return (
    <Link
      href={`/grievances/${id}`}
      className="block group rounded-lg border border-border bg-card p-4 transition-all hover:border-accent hover:shadow-md focus"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-subtitle font-semibold text-primary">{name}</h3>
            {status}
          </div>
          {pointPerson ? <PointPerson pointPersonName={pointPerson} /> : null}
        </div>
        {date ? <div className="sm:text-right">{date}</div> : null}
      </div>
      {footer}
    </Link>
  );
}
