interface TransactionFiltersProps {
  status:         string;
  type:           string;
  onStatus:       (value: string) => void;
  onType:         (value: string) => void;
}

export function TransactionFilters({ status, type, onStatus, onType }: TransactionFiltersProps) {
  const selectClass = 'h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={status}
        onChange={(e) => onStatus(e.target.value)}
        className={selectClass}
        aria-label="Filtrar por estado"
      >
        <option value="">Todos los estados</option>
        <option value="Pending">Pendiente</option>
        <option value="Completed">Completada</option>
        <option value="Rejected">Rechazada</option>
      </select>

      <select
        value={type}
        onChange={(e) => onType(e.target.value)}
        className={selectClass}
        aria-label="Filtrar por tipo"
      >
        <option value="">Todos los tipos</option>
        <option value="Debit">Débito</option>
        <option value="Credit">Crédito</option>
      </select>
    </div>
  );
}
