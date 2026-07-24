import { isValidStatus, STATUS_STYLES } from "../status";

export function getStatusClasses(status: string): string {
  if (isValidStatus(status)) {
    const style = STATUS_STYLES[status];
    return `${style.backgroundClass} ${style.borderClass} ${style.textClass}`;
  }
  return "bg-neutral-50 text-neutral-800";
}

interface StatusTagProps {
  status: string;
  size?: "default" | "large";
}

export function StatusTag({ status, size = "default" }: StatusTagProps) {
  const fontSize = size === "large" ? "text-base" : "text-sm";

  return (
    <span
      className={`inline-flex items-center self-start rounded-md px-2 py-0.5 ${fontSize} font-medium border ${getStatusClasses(status)}`}
    >
      {status}
    </span>
  );
}
