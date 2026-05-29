interface ErrorAlertProps {
  message: string | null;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-xl bg-[#fff2f2] px-4 py-3 text-[13px] text-[#cc0000] ring-1 ring-[#ff3b30]/20">
      <svg className="mt-px h-4 w-4 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 5v3.5M8 10.5v.5" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
