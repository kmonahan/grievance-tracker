export default function Button({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="button focus self-start" {...props}>
      {children}
    </button>
  );
}
