import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-[#1d1d1f]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={[
          'h-10 w-full rounded-xl border bg-white px-3.5 text-[14px] text-[#1d1d1f]',
          'placeholder:text-[#aeaeb2] outline-none transition-all duration-200',
          'focus:ring-3 focus:ring-[#0071e3]/15 focus:border-[#0071e3]/60',
          'disabled:cursor-not-allowed disabled:bg-[#f5f5f7] disabled:text-[#aeaeb2]',
          error
            ? 'border-[#ff3b30]/60 ring-2 ring-[#ff3b30]/10'
            : 'border-black/[0.1] hover:border-black/[0.18]',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-[12px] text-[#ff3b30]">{error}</p>}
    </div>
  ),
);
Input.displayName = 'Input';
