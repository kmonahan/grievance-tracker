export default function FormSelect({
  id,
  label,
  children,
  errors,
  ...props
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  errors?: string[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-2 w-full">
      <label
        htmlFor={id}
        className="label select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        className="border-border w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-lg shadow-xs transition-all focus cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base  aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-11"
        {...props}
      >
        {children}
      </select>
      {errors?.map((message) => (
        <p key={message} className="text-destructive text-lg">
          {message}
        </p>
      ))}
    </div>
  );
}
