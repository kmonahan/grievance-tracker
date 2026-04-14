import Link from "next/link";
import type { Grievance } from "~/app/grievances/types";
import { getAccessToken } from "~/app/lib/auth";
import { StepFilterView } from "./StepFilterView";

export default async function GrievancesByStepPage() {
  const accessToken = await getAccessToken();
  const headers = { Authorization: `Bearer ${accessToken}` };

  const [step1Response, step2Response, step3Response] = await Promise.all([
    fetch(`${process.env.BACKEND_URL}/grievances/step/ONE`, { headers }),
    fetch(`${process.env.BACKEND_URL}/grievances/step/TWO`, { headers }),
    fetch(`${process.env.BACKEND_URL}/grievances/step/THREE`, { headers }),
  ]);

  const [{ grievances: step1 }, { grievances: step2 }, { grievances: step3 }] =
    await Promise.all([
      step1Response.json() as Promise<{ grievances: Grievance[] }>,
      step2Response.json() as Promise<{ grievances: Grievance[] }>,
      step3Response.json() as Promise<{ grievances: Grievance[] }>,
    ]);

  const grievances = [...step1, ...step2, ...step3];

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

        <StepFilterView grievances={grievances} />
      </div>
    </main>
  );
}
