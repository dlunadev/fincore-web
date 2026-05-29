'use client';

import Link from 'next/link';
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

export function TransactionsTable({ transactions, total, total_pages, page, is_loading, error, onPage }: TransactionsTableProps) {
  if (is_loading && transactions.length === 0) {
    return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className={['flex flex-col gap-4 transition-opacity', is_loading ? 'opacity-60' : ''].join(' ')}>
      <ErrorAlert message={error} />

      {transactions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <p className="text-sm text-gray-500">No se encontraron transacciones.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                {['Origen', 'Destino', 'Tipo', 'Monto', 'Estado', 'Fecha', 'Acciones'].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs text-gray-700">{tx.source_account?.account_number ?? tx.source_account_id}</p>
                    {tx.source_account && <p className="text-xs text-gray-500">{tx.source_account.holder_name}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs text-gray-700">{tx.destination_account?.account_number ?? tx.destination_account_id}</p>
                    {tx.destination_account && <p className="text-xs text-gray-500">{tx.destination_account.holder_name}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{TYPE_LABEL[tx.type]}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{formatAmount(tx.amount)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[tx.status]}>{STATUS_LABEL[tx.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(tx.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/transacciones/${tx.id}`}
                      className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                    >
                      Ver detalle
                    </Link>
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
