'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';
import { Pagination } from '@/components/ui/pagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { Account } from '@/sdk';

interface AccountsTableProps {
  accounts:        Account[];
  total:           number;
  total_pages:     number;
  page:            number;
  is_loading:      boolean;
  confirmId:       string | null;
  deactivating:    boolean;
  deactivateError: string | null;
  onPage:          (page: number) => void;
  onDeactivate:    (id: string) => void;
  onConfirm:       () => void;
  onCancel:        () => void;
}

function formatBalance(amount: number, currency: string) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency', currency, minimumFractionDigits: 2,
  }).format(amount);
}

export function AccountsTable({
  accounts, total, total_pages, page, is_loading,
  confirmId, deactivating, deactivateError,
  onPage, onDeactivate, onConfirm, onCancel,
}: AccountsTableProps) {
  if (is_loading && accounts.length === 0) {
    return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className={['flex flex-col gap-4 transition-opacity', is_loading ? 'opacity-60' : ''].join(' ')}>

      <ErrorAlert message={deactivateError} />

      {accounts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <p className="text-sm text-gray-500">No se encontraron cuentas.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                {['Número', 'Titular', 'Moneda', 'Saldo', 'Estado', 'Acciones'].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{account.account_number}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{account.holder_name}</td>
                  <td className="px-4 py-3 text-gray-600">{account.currency}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {formatBalance(account.balance, account.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={account.status === 'Active' ? 'success' : 'neutral'}>
                      {account.status === 'Active' ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {confirmId === account.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">¿Confirmar?</span>
                        <Button size="sm" variant="danger" isLoading={deactivating} onClick={onConfirm}>
                          Sí
                        </Button>
                        <Button size="sm" variant="secondary" onClick={onCancel}>
                          No
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/cuentas/${account.id}`}
                          className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                        >
                          Editar
                        </Link>
                        {account.status === 'Active' && (
                          <Button
                            size="sm" variant="ghost"
                            className="text-xs text-red-600 hover:bg-red-50"
                            onClick={() => onDeactivate(account.id)}
                          >
                            Desactivar
                          </Button>
                        )}
                      </div>
                    )}
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
