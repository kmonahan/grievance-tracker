"use client";

import { useEffect, useRef } from "react";

export default function Modal({
  children,
  open,
  onClose,
}: {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <dialog> natively handles keyboard interaction (Escape to close)
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleDialogClick}
      className="relative w-[calc(100%-2rem)] max-w-md m-auto bg-card text-card-foreground rounded-xl border-2 shadow-xl backdrop:bg-black/50 p-0"
    >
      <button
        type="button"
        onClick={() => dialogRef.current?.close()}
        aria-label="Close"
        className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      {children}
    </dialog>
  );
}
