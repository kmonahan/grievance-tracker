import type { JSX } from "react";

export interface PointPersonProps {
  pointPersonName: string;
}

export default function PointPerson({
  pointPersonName,
}: PointPersonProps): JSX.Element {
  const pointPersonInitials = pointPersonName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="flex items-center gap-2 text-base">
      <span className="initials">{pointPersonInitials}</span>
      <span className="text-muted-foreground">{pointPersonName}</span>
    </div>
  );
}
