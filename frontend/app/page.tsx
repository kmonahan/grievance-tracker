export default function Home() {
  return (
    <main className="flex flex-col">
      <section>
        <h2 className="text-4xl font-mono font-bold text-primary">
          Upcoming Deadlines
        </h2>
        <ol>
          <li>
            <div>
              <h3>
                <a href="#">Test Grievance #1</a>
              </h3>
              <p>Waiting to Schedule - January 6, 2026</p>
              <p>Point Person: Walter Reuther</p>
            </div>
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
