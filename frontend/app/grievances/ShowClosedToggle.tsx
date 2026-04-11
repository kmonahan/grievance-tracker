"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ShowClosedToggleProps {
  showClosed: boolean;
  closedCount: number;
}

export function ShowClosedToggle({
  showClosed,
  closedCount,
}: ShowClosedToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function toggle() {
    const params = new URLSearchParams(searchParams.toString());
    if (showClosed) {
      params.delete("showClosed");
    } else {
      params.set("showClosed", "true");
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-subtitle text-sm font-medium transition-colors ${
        showClosed
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="size-4"
        aria-hidden="true"
      >
        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
        <path
          fillRule="evenodd"
          d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          clipRule="evenodd"
        />
      </svg>
      {showClosed ? "Hide" : "Show"} closed ({closedCount})
    </button>
  );
}
