'use client';

import { Badge } from '@/components/ui/badge';
import { ErrorAlert } from '@/components/ui/error-alert';
import { Pagination } from '@/components/ui/pagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { Transaction, TransactionStatus, TransactionType } from '@/sdk';

interface TransactionsTableProps {
  transactions:  Transaction[];
  total:         number;
  total_pages:   number;
  page:          number;
  is_loading:    boolean;
  error:         string | null;
  onPage:        (page: number) => void;
  onDetail:      (id: string) => void;
}

const STATUS_LABEL: Record<TransactionStatus, string> = {
  Pending:   'Pendiente',
  Completed: 'Completada',
  Rejected:  'Rechazada',
};

const STATUS_VARIANT: Record<TransactionStatus, 'warning' | 'success' | 'danger'> = {
  Pending:   'warning',
  Completed: 'success',
  Rejected:  'danger',
};

const TYPE_LABEL: Record<TransactionType, string> = {
  Debit:  'Débito',
  Credit: 'Crédito',
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const COLS = ['Origen', 'Destino', 'Tipo', 'Monto', 'Estado', 'Fecha', 'Acciones'];

export function TransactionsTable({ transactions, total, total_pages, page, is_loading, error, onPage, onDetail }: TransactionsTableProps) {
  if (is_loading && transactions.length === 0) {
    return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className={['flex flex-col gap-4 transition-opacity duration-200', is_loading ? 'opacity-50' : ''].join(' ')}>
      <ErrorAlert message={error} />

      {transactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/[0.1] py-20 text-center">
          <p className="text-[14px] text-[#6e6e73]">No se encontraron transacciones.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/[0.06] bg-[#fafafa]">
                {COLS.map((col) => (
                  <th key={col} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-[#aeaeb2]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {transactions.map((tx) => (
                <tr key={tx.id} className="group transition-colors hover:bg-[#f5f5f7]/60">
                  <td className="px-5 py-3.5">
                    <p className="font-mono text-[12px] text-[#6e6e73]">{tx.source_account?.account_number ?? tx.source_account_id}</p>
                    {tx.source_account && <p className="text-[12px] text-[#aeaeb2]">{tx.source_account.holder_name}</p>}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-mono text-[12px] text-[#6e6e73]">{tx.destination_account?.account_number ?? tx.destination_account_id}</p>
                    {tx.destination_account && <p className="text-[12px] text-[#aeaeb2]">{tx.destination_account.holder_name}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#6e6e73]">{TYPE_LABEL[tx.type]}</td>
                  <td className="px-5 py-3.5 text-[14px] font-semibold text-[#1d1d1f]">{formatAmount(tx.amount)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={STATUS_VARIANT[tx.status]}>{STATUS_LABEL[tx.status]}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-[#aeaeb2]">{formatDate(tx.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => onDetail(tx.id)}
                      className="rounded-lg px-2.5 py-1 text-[12px] font-medium text-[#0071e3] transition-colors hover:bg-[#0071e3]/10"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} total_pages={total_pages} total={total} page_size={10} onPage={onPage} />
    </div>
  );
}
