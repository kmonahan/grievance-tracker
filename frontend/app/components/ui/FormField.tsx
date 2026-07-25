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
        className="label select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className="placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-border w-full min-w-0 rounded-md border bg-card px-3 py-1 text-lg shadow-xs transition-all disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base focus aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-11"
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
