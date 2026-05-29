'use client';

import { useState, useRef, useEffect } from 'react';

interface TransactionFiltersProps {
  status:   string;
  type:     string;
  onStatus: (value: string) => void;
  onType:   (value: string) => void;
}

interface Option {
  value: string;
  label: string;
}

function FilterDropdown({
  value,
  onChange,
  options,
  placeholder,
}: {
  value:       string;
  onChange:    (v: string) => void;
  options:     Option[];
  placeholder: string;
}) {
  const [open, setOpen]   = useState(false);
  const containerRef      = useRef<HTMLDivElement>(null);
  const selected          = options.find((o) => o.value === value);
  const isActive          = !!value;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          'flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium shadow-sm',
          'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
          isActive
            ? 'border-blue-400 bg-blue-50 text-blue-700 focus:border-blue-400'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 focus:border-blue-400',
        ].join(' ')}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <svg
          className={['h-3.5 w-3.5 transition-transform duration-150', open ? 'rotate-180' : '', isActive ? 'text-blue-400' : 'text-gray-400'].join(' ')}
          viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1.5 min-w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {[{ value: '', label: placeholder }, ...options].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={[
                'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors duration-100',
                opt.value === value
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50',
              ].join(' ')}
            >
              {opt.value === value && (
                <svg className="h-3.5 w-3.5 flex-shrink-0 text-blue-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8l4 4 6-6" />
                </svg>
              )}
              <span className={opt.value === value ? '' : 'pl-5'}>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const STATUS_OPTIONS: Option[] = [
  { value: 'Pending',   label: 'Pendiente'  },
  { value: 'Completed', label: 'Completada' },
  { value: 'Rejected',  label: 'Rechazada'  },
];

const TYPE_OPTIONS: Option[] = [
  { value: 'Debit',  label: 'Débito'  },
  { value: 'Credit', label: 'Crédito' },
];

export function TransactionFilters({ status, type, onStatus, onType }: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterDropdown
        value={status}
        onChange={onStatus}
        options={STATUS_OPTIONS}
        placeholder="Todos los estados"
      />
      <FilterDropdown
        value={type}
        onChange={onType}
        options={TYPE_OPTIONS}
        placeholder="Todos los tipos"
      />
    </div>
  );
}
