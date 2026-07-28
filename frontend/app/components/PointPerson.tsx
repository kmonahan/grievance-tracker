import type { JSX } from "react";
import { getInitials } from "~/lib/format";

export interface PointPersonProps {
  pointPersonName: string;
}

export default function PointPerson({
  pointPersonName,
}: PointPersonProps): JSX.Element {
  return (
    <div className="flex items-center gap-2 text-base">
      <span className="initials">{getInitials(pointPersonName)}</span>
      <span className="text-muted-foreground">{pointPersonName}</span>
    </div>
  );
}
