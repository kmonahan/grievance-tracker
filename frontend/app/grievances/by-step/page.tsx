import Link from "next/link";
import type { Grievance } from "~/app/grievances/types";
import { StepFilterView } from "./StepFilterView";

// Placeholder grievances — backend integration coming in a later step
const PLACEHOLDER_GRIEVANCES: Grievance[] = [
  {
    id: 1,
    name: "Unauthorized Schedule Change — M. Williams",
    description: "Member was moved off preferred shift without proper notice.",
    category: "Scheduling",
    point_person: "Alex Rivera",
    escalations: [
      {
        id: 1,
        date: "2026-03-15",
        step: "Step #1",
        status: "Waiting to Schedule",
        date_due: "2026-04-20",
        hearing_date: null,
        deadline_missed: false,
        user: { id: 1, is_active: true, name: "Alex Rivera" },
      },
    ],
  },
  {
    id: 2,
    name: "Denied Bereavement Leave — T. Johnson",
    description: "Member was denied bereavement leave for a sibling's passing.",
    category: "Leave",
    point_person: "Sam Chen",
    escalations: [
      {
        id: 2,
        date: "2026-03-20",
        step: "Step #1",
        status: "Scheduled",
        date_due: "2026-04-25",
        hearing_date: "2026-04-18",
        deadline_missed: false,
        user: { id: 2, is_active: true, name: "Sam Chen" },
      },
    ],
  },
  {
    id: 3,
    name: "Excessive Workload — Children's Dept.",
    description:
      "Three positions left unfilled for over six months, placing undue burden on remaining staff.",
    category: "Workload",
    point_person: "Jordan Lee",
    escalations: [
      {
        id: 3,
        date: "2026-03-28",
        step: "Step #1",
        status: "Waiting to File",
        date_due: null,
        hearing_date: null,
        deadline_missed: false,
        user: { id: 3, is_active: true, name: "Jordan Lee" },
      },
    ],
  },
  {
    id: 4,
    name: "Unsafe Workstation Conditions — Reference Desk",
    description:
      "Ergonomic hazards at reference desk not addressed after initial filing.",
    category: "Health & Safety",
    point_person: "Jordan Lee",
    escalations: [
      {
        id: 4,
        date: "2026-02-01",
        step: "Step #1",
        status: "Waiting to File",
        date_due: null,
        hearing_date: null,
        deadline_missed: false,
        user: { id: 3, is_active: true, name: "Jordan Lee" },
      },
      {
        id: 5,
        date: "2026-03-01",
        step: "Step #2",
        status: "Waiting on Decision",
        date_due: "2026-04-15",
        hearing_date: "2026-03-28",
        deadline_missed: false,
        user: { id: 3, is_active: true, name: "Jordan Lee" },
      },
    ],
  },
  {
    id: 5,
    name: "Accommodation Request Ignored — B. Okonkwo",
    description:
      "Member's written request for accommodation was not acknowledged within required timeframe.",
    category: "Accommodation",
    point_person: "Casey Park",
    escalations: [
      {
        id: 6,
        date: "2026-02-10",
        step: "Step #1",
        status: "Waiting to File",
        date_due: null,
        hearing_date: null,
        deadline_missed: false,
        user: { id: 4, is_active: true, name: "Casey Park" },
      },
      {
        id: 7,
        date: "2026-03-10",
        step: "Step #2",
        status: "Scheduled",
        date_due: "2026-04-30",
        hearing_date: "2026-04-22",
        deadline_missed: false,
        user: { id: 4, is_active: true, name: "Casey Park" },
      },
    ],
  },
  {
    id: 6,
    name: "Improper Discipline — D. Torres",
    description:
      "Member received a written warning without proper just cause documentation.",
    category: "Discipline",
    point_person: "Casey Park",
    escalations: [
      {
        id: 8,
        date: "2026-01-10",
        step: "Step #1",
        status: "Waiting to File",
        date_due: null,
        hearing_date: null,
        deadline_missed: false,
        user: { id: 4, is_active: true, name: "Casey Park" },
      },
      {
        id: 9,
        date: "2026-02-01",
        step: "Step #2",
        status: "Waiting to File",
        date_due: null,
        hearing_date: null,
        deadline_missed: false,
        user: { id: 4, is_active: true, name: "Casey Park" },
      },
      {
        id: 10,
        date: "2026-03-10",
        step: "Step #3",
        status: "Scheduled",
        date_due: "2026-05-01",
        hearing_date: "2026-04-24",
        deadline_missed: false,
        user: { id: 4, is_active: true, name: "Casey Park" },
      },
    ],
  },
  {
    id: 7,
    name: "Seniority Violation — Overtime Assignment",
    description:
      "Overtime distributed out of seniority order on multiple occasions in Q1.",
    category: "Scheduling",
    point_person: "Alex Rivera",
    escalations: [
      {
        id: 11,
        date: "2026-01-05",
        step: "Step #1",
        status: "Waiting to File",
        date_due: null,
        hearing_date: null,
        deadline_missed: false,
        user: { id: 1, is_active: true, name: "Alex Rivera" },
      },
      {
        id: 12,
        date: "2026-02-05",
        step: "Step #2",
        status: "Waiting to File",
        date_due: null,
        hearing_date: null,
        deadline_missed: false,
        user: { id: 1, is_active: true, name: "Alex Rivera" },
      },
      {
        id: 13,
        date: "2026-03-05",
        step: "Step #3",
        status: "Waiting on Decision",
        date_due: "2026-04-10",
        hearing_date: "2026-03-20",
        deadline_missed: false,
        user: { id: 1, is_active: true, name: "Alex Rivera" },
      },
    ],
  },
];

export default function GrievancesByStepPage() {
  const openGrievances = PLACEHOLDER_GRIEVANCES.filter((g) => {
    const latest = g.escalations.at(-1);
    return (
      !latest || !["Resolved", "Denied", "Withdrawn"].includes(latest.status)
    );
  });

  return (
    <main className="mx-auto w-full px-5 py-8 md:px-6">
      <div className="mx-auto w-full max-w-4xl">
        {/* Page header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-title text-4xl font-bold text-primary">
            By Step
          </h1>
          <Link
            href="/grievances/create"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-subtitle text-base font-semibold text-primary-foreground transition-colors hover:bg-secondary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Add Grievance
          </Link>
        </div>

        <StepFilterView grievances={openGrievances} />
      </div>
    </main>
  );
}
