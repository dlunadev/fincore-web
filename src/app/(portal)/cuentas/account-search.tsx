interface AccountSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function AccountSearch({ value, onChange }: AccountSearchProps) {
  return (
    <div className="relative max-w-sm">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre o número..."
        className="h-10 w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm
          text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none
          focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
