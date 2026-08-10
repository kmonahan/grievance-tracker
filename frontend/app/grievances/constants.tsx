import type { Grievance, StepStatus } from "~/app/grievances/types";
import { CLOSED_STATUSES } from "../status";

export function isClosed(grievance: Grievance): boolean {
  const latest = grievance.escalations.at(-1);
  return !!latest && CLOSED_STATUSES.has(latest.status);
}

export const FILTER_STEPS = [
  { label: "Step 1", value: "Step #1" },
  { label: "Step 2", value: "Step #2" },
  { label: "Step 3", value: "Step #3" },
];

export const STEP_DISPLAY_TO_ENUM: Record<string, string> = {
  "Step #1": "ONE",
  "Step #2": "TWO",
  "Step #3": "THREE",
};

// Linear progression of non-terminal escalation states
export const STATE_SEQUENCE: StepStatus[] = [
  {
    stepEnum: "ONE",
    stepDisplay: "Step #1",
    statusEnum: "WAITING_TO_SCHEDULE",
    statusDisplay: "Waiting to Schedule",
  },
  {
    stepEnum: "ONE",
    stepDisplay: "Step #1",
    statusEnum: "SCHEDULED",
    statusDisplay: "Scheduled",
  },
  {
    stepEnum: "ONE",
    stepDisplay: "Step #1",
    statusEnum: "WAITING_TO_FILE",
    statusDisplay: "Prepare for Next Step",
  },
  {
    stepEnum: "TWO",
    stepDisplay: "Step #2",
    statusEnum: "WAITING_TO_SCHEDULE",
    statusDisplay: "Waiting to Schedule",
  },
  {
    stepEnum: "TWO",
    stepDisplay: "Step #2",
    statusEnum: "SCHEDULED",
    statusDisplay: "Scheduled",
  },
  {
    stepEnum: "TWO",
    stepDisplay: "Step #2",
    statusEnum: "WAITING_ON_DECISION",
    statusDisplay: "Waiting on Decision",
  },
  {
    stepEnum: "TWO",
    stepDisplay: "Step #2",
    statusEnum: "WAITING_TO_FILE",
    statusDisplay: "Prepare for Next Step",
  },
  {
    stepEnum: "THREE",
    stepDisplay: "Step #3",
    statusEnum: "WAITING_TO_SCHEDULE",
    statusDisplay: "Waiting to Schedule",
  },
  {
    stepEnum: "THREE",
    stepDisplay: "Step #3",
    statusEnum: "SCHEDULED",
    statusDisplay: "Scheduled",
  },
  {
    stepEnum: "THREE",
    stepDisplay: "Step #3",
    statusEnum: "WAITING_ON_DECISION",
    statusDisplay: "Waiting on Decision",
  },
];

export const ALWAYS_AVAILABLE = [
  { statusEnum: "RESOLVED", statusDisplay: "Resolved" },
  { statusEnum: "DENIED", statusDisplay: "Denied" },
  { statusEnum: "WITHDRAWN", statusDisplay: "Withdrawn" },
  { statusEnum: "IN_ABEYANCE", statusDisplay: "In Abeyance" },
];
