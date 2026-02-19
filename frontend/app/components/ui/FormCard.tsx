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
      <div className="w-full max-w-md">
        <div className="mt-8 bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 border-2 shadow-xl">
          <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 space-y-1 pb-6">
            <h1 className="font-semibold font-subtitle text-2xl text-center">
              {title}
            </h1>
          </div>
          <form className="px-6 space-y-5" action={action}>{children}</form>
        </div>
      </div>
    </main>
  );
}
