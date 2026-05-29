'use client';

import { useEffect } from 'react';

interface DialogProps {
  open:     boolean;
  title:    string;
  onClose:  () => void;
  children: React.ReactNode;
  size?:    'sm' | 'md' | 'lg';
}

const SIZE: Record<NonNullable<DialogProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Dialog({ open, title, onClose, children, size = 'md' }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className={['relative z-10 w-full rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.15)] border border-black/[0.06]', SIZE[size]].join(' ')}>
        <div className="flex items-center justify-between border-b border-black/[0.06] px-6 py-4">
          <h2 className="text-[15px] font-semibold text-[#1d1d1f]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#6e6e73] transition-colors hover:bg-black/[0.06] hover:text-[#1d1d1f]"
            aria-label="Cerrar"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
