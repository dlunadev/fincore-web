import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className = '', children, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-[#1d1d1f]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={[
            'h-10 w-full appearance-none rounded-xl border bg-white pl-3.5 pr-9 text-[14px] text-[#1d1d1f]',
            'outline-none transition-all duration-200 cursor-pointer',
            'focus:ring-3 focus:ring-[#0071e3]/15 focus:border-[#0071e3]/60',
            'disabled:cursor-not-allowed disabled:bg-[#f5f5f7] disabled:text-[#aeaeb2]',
            error
              ? 'border-[#ff3b30]/60 ring-2 ring-[#ff3b30]/10'
              : 'border-black/[0.1] hover:border-black/[0.18]',
            className,
          ].join(' ')}
          {...props}
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aeaeb2]"
          viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </div>
      {error && <p className="text-[12px] text-[#ff3b30]">{error}</p>}
    </div>
  ),
);
Select.displayName = 'Select';
