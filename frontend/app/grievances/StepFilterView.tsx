"use client";

import type { Grievance } from "~/app/grievances/types";

interface StepFilterViewProps {
  openGrievances: Grievance[];
  closedGrievances: Grievance[];
  showClosed: boolean;
}

export function StepFilterView(
  _props: StepFilterViewProps,
): React.ReactElement {
  throw new Error("Not implemented");
}
