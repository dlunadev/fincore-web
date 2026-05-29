'use client';

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
  onEdit:          (id: string) => void;
  onDeactivate:    (id: string) => void;
  onConfirm:       () => void;
  onCancel:        () => void;
}

function formatBalance(amount: number, currency: string) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency', currency, minimumFractionDigits: 2,
  }).format(amount);
}

const COLS = ['Número', 'Titular', 'Moneda', 'Saldo', 'Estado', 'Acciones'];

export function AccountsTable({
  accounts, total, total_pages, page, is_loading,
  confirmId, deactivating, deactivateError,
  onPage, onEdit, onDeactivate, onConfirm, onCancel,
}: AccountsTableProps) {
  if (is_loading && accounts.length === 0) {
    return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className={['flex flex-col gap-4 transition-opacity duration-200', is_loading ? 'opacity-50' : ''].join(' ')}>

      <ErrorAlert message={deactivateError} />

      {accounts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/[0.1] py-20 text-center">
          <p className="text-[14px] text-[#6e6e73]">No se encontraron cuentas.</p>
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
              {accounts.map((account) => (
                <tr key={account.id} className="group transition-colors hover:bg-[#f5f5f7]/60">
                  <td className="px-5 py-3.5 font-mono text-[12px] text-[#6e6e73]">{account.account_number}</td>
                  <td className="px-5 py-3.5 text-[14px] font-medium text-[#1d1d1f]">{account.holder_name}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#6e6e73]">{account.currency}</td>
                  <td className="px-5 py-3.5 text-[14px] font-semibold text-[#1d1d1f]">
                    {formatBalance(account.balance, account.currency)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={account.status === 'Active' ? 'success' : 'neutral'}>
                      {account.status === 'Active' ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    {confirmId === account.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[#6e6e73]">¿Confirmar?</span>
                        <Button size="sm" variant="danger" isLoading={deactivating} onClick={onConfirm}>Sí</Button>
                        <Button size="sm" variant="secondary" onClick={onCancel}>No</Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(account.id)}
                          className="rounded-lg px-2.5 py-1 text-[12px] font-medium text-[#0071e3] transition-colors hover:bg-[#0071e3]/10"
                        >
                          Editar
                        </button>
                        {account.status === 'Active' && (
                          <button
                            onClick={() => onDeactivate(account.id)}
                            className="rounded-lg px-2.5 py-1 text-[12px] font-medium text-[#ff3b30] transition-colors hover:bg-[#ff3b30]/10"
                          >
                            Desactivar
                          </button>
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
