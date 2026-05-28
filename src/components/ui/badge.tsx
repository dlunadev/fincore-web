import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const VARIANT: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-700 ring-green-200',
  warning: 'bg-amber-100 text-amber-700 ring-amber-200',
  danger:  'bg-red-100   text-red-700   ring-red-200',
  neutral: 'bg-gray-100  text-gray-600  ring-gray-200',
};

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        VARIANT[variant],
      ].join(' ')}
    >
      {children}
    </span>
  );
}
