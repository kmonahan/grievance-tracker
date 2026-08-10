import { getAccessToken } from "~/app/lib/auth";
import type { Stage } from "./StageRow";
import StageRow from "./StageRow";

export default async function StagesPage(): Promise<React.ReactElement> {
  const token = await getAccessToken();

  const response = await fetch(`${process.env.BACKEND_URL}/stages`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const stages: Stage[] = await response.json();

  return (
    <main className="px-4 py-8 max-w-2xl mx-auto w-full">
      <div className="mb-8 flex flex-col gap-4">
        <h1 className="font-title text-3xl md:text-4xl uppercase font-bold text-primary-foreground">
          Stages
        </h1>

        {stages.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border bg-card py-12 text-center">
            <p className="font-subtitle text-muted-foreground">
              No stages found.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {stages.map((stage) => (
              <StageRow key={`${stage.step}-${stage.status}`} stage={stage} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
