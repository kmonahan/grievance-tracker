import { forwardRef } from "react";

const FormField = forwardRef<
  HTMLInputElement,
  {
    id: string;
    label: string;
    type?: React.HTMLInputTypeAttribute;
    errors?: string[];
  } & React.InputHTMLAttributes<HTMLInputElement>
>(function FormField({ id, label, type = "text", errors, ...props }, ref) {
  return (
    <div className="space-y-2 w-full">
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-base leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 font-subtitle"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className="file:text-primary placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-lg shadow-xs transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base focus aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-11"
        ref={ref}
        {...props}
      />
      {errors?.map((message) => (
        <p key={message} className="text-destructive text-lg">
          {message}
        </p>
      ))}
    </div>
  );
});

export default FormField;
