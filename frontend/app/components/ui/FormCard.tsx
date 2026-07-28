export default function FormCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <main className="w-full mx-auto px-6 py-8 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="mt-8 bg-card text-primary flex flex-col gap-6 rounded-xl border py-6 border-primary/20 shadow-lg">
          <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 space-y-1">
            <h1 className="font-title text-3xl md:text-4xl uppercase font-bold">
              {title}
            </h1>
          </div>
          <form
            className="px-6 flex flex-col pb-6 gap-4 items-start"
            action={action}
          >
            {children}
          </form>
        </div>
      </div>
    </main>
  );
}
