'use client';

import { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  value:        string;
  onChange:     (value: string) => void;
  options:      SelectOption[];
  label?:       string;
  placeholder?: string;
  error?:       string;
  disabled?:    boolean;
}

export function SelectField({
  value,
  onChange,
  options,
  label,
  placeholder = 'Seleccionar...',
  error,
  disabled,
}: SelectFieldProps) {
  const [open, setOpen]  = useState(false);
  const containerRef     = useRef<HTMLDivElement>(null);
  const selected         = options.find((o) => o.value === value);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSelect = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[13px] font-medium text-[#1d1d1f]">{label}</label>
      )}

      <div ref={containerRef} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((o) => !o)}
          className={[
            'flex h-10 w-full items-center justify-between rounded-xl border bg-white pl-3.5 pr-3 text-[14px]',
            'outline-none transition-all duration-200',
            'focus:ring-3 focus:ring-[#0071e3]/15 focus:border-[#0071e3]/60',
            'disabled:cursor-not-allowed disabled:bg-[#f5f5f7] disabled:text-[#aeaeb2]',
            error
              ? 'border-[#ff3b30]/60 ring-2 ring-[#ff3b30]/10'
              : 'border-black/[0.1] hover:border-black/[0.18]',
            !selected ? 'text-[#aeaeb2]' : 'text-[#1d1d1f]',
          ].join(' ')}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <svg
            className={['h-4 w-4 flex-shrink-0 text-[#aeaeb2] transition-transform duration-200', open ? 'rotate-180' : ''].join(' ')}
            viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </button>

        {open && (
          <div className="absolute left-0 top-full z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <div className="max-h-56 overflow-y-auto p-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={[
                    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-colors duration-100',
                    opt.value === value
                      ? 'bg-[#0071e3]/10 text-[#0071e3] font-medium'
                      : 'text-[#1d1d1f] hover:bg-[#f5f5f7]',
                  ].join(' ')}
                >
                  <span className={['h-3.5 w-3.5 flex-shrink-0', opt.value === value ? 'opacity-100' : 'opacity-0'].join(' ')}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="text-[#0071e3]">
                      <path d="M3 8l4 4 6-6" />
                    </svg>
                  </span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-[12px] text-[#ff3b30]">{error}</p>}
    </div>
  );
}
