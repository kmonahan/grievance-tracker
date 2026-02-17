import GrievanceDeadlineCard from "./components/GrievanceDeadlineCard";

export default function Home() {
  return (
    <main className="flex flex-col">
      <section>
        <h2 className="text-4xl font-mono font-bold text-primary">
          Upcoming Deadlines
        </h2>
        <ol className="mt-4 space-y-3">
          <li>
            <GrievanceDeadlineCard />
          </li>
        </ol>
        <a href="#">See all grievances by deadline</a>
      </section>
      <section>
        <h2 className="text-4xl font-mono font-bold text-primary">
          Recent Activity
        </h2>
      </section>
    </main>
  );
}
