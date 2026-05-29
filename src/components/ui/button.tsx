import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  isLoading?: boolean;
  children:  ReactNode;
}

const VARIANT: Record<Variant, string> = {
  primary:   'bg-[#0071e3] text-white hover:bg-[#0077ed] active:bg-[#006edb] shadow-sm shadow-blue-600/20',
  secondary: 'border border-black/[0.12] bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] active:bg-[#ebebeb]',
  danger:    'bg-[#ff3b30] text-white hover:bg-[#ff453a] active:bg-[#e0352b] shadow-sm shadow-red-600/20',
  ghost:     'text-[#6e6e73] hover:bg-black/[0.05] hover:text-[#1d1d1f]',
};

const SIZE: Record<Size, string> = {
  sm: 'h-8  px-3   text-[12px]',
  md: 'h-9  px-4   text-[13px]',
  lg: 'h-11 px-5   text-[15px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center gap-1.5 rounded-xl font-medium',
        'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]/40 focus-visible:ring-offset-1',
        'active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT[variant],
        SIZE[size],
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading && (
        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
