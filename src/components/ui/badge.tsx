import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const VARIANT: Record<BadgeVariant, string> = {
  success: 'bg-[#d1fae5] text-[#065f46]',
  warning: 'bg-[#fef3c7] text-[#92400e]',
  danger:  'bg-[#fee2e2] text-[#991b1b]',
  neutral: 'bg-[#f2f2f7] text-[#6e6e73]',
};

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
        VARIANT[variant],
      ].join(' ')}
    >
      {children}
    </span>
  );
}
