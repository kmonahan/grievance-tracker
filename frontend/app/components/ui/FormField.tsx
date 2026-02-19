import { forwardRef } from "react";

const FormField = forwardRef<
  HTMLInputElement,
  {
    id: string;
    label: string;
    type?: React.HTMLInputTypeAttribute;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(function FormField({ id, label, type = "text", ...props }, ref) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 font-subtitle"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-11"
        ref={ref}
        {...props}
      />
    </div>
  );
});

export default FormField;
