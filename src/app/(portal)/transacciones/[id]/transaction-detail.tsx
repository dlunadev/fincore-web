'use client';

import { use, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';
import { useUpdateStatus, fetchTransactionDetail, fetchAuditLogs } from './use-transaction-detail';
import type { TransactionDetailResult, AuditLogsResult } from './use-transaction-detail';
import type { TransactionStatus, TransactionType } from '@/models';

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
const TYPE_LABEL: Record<TransactionType, string> = { Debit: 'Débito', Credit: 'Crédito' };

function formatAmount(amount: number) {
  return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 }).format(amount);
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

interface TransactionDetailProps {
  txPromise:   Promise<TransactionDetailResult>;
  logsPromise: Promise<AuditLogsResult>;
}

export function TransactionDetail({ txPromise, logsPromise }: TransactionDetailProps) {
  const txResult = use(txPromise);

  if (!txResult.ok) return <ErrorAlert message={txResult.error} />;

  return <TransactionDetailInner transaction={txResult.data} logsPromise={logsPromise} />;
}

function TransactionDetailInner({
  transaction,
  logsPromise,
}: {
  transaction: import('@/models').Transaction;
  logsPromise: Promise<AuditLogsResult>;
}) {
  const [txPromise, setTxPromise] = useState<Promise<TransactionDetailResult>>(
    () => Promise.resolve({ ok: true as const, data: transaction }),
  );
  const refreshedTx = use(txPromise);
  const tx = refreshedTx.ok ? refreshedTx.data : transaction;

  const [auditPromise, setAuditPromise] = useState(() => logsPromise);

  const onSuccess = () => {
    setTxPromise(fetchTransactionDetail(transaction.id));
    setAuditPromise(fetchAuditLogs(transaction.id));
  };

  const { isPending, error, confirmAction, setConfirmAction, confirm } = useUpdateStatus(tx, onSuccess);

  return (
    <div className="flex flex-col gap-6">

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">Detalle de transacción</h2>
          <Badge variant={STATUS_VARIANT[tx.status]}>{STATUS_LABEL[tx.status]}</Badge>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div>
            <dt className="text-xs text-gray-500">Cuenta origen</dt>
            <dd className="font-mono text-gray-800">{tx.source_account?.account_number ?? tx.source_account_id}</dd>
            {tx.source_account && <dd className="text-xs text-gray-500">{tx.source_account.holder_name}</dd>}
          </div>
          <div>
            <dt className="text-xs text-gray-500">Cuenta destino</dt>
            <dd className="font-mono text-gray-800">{tx.destination_account?.account_number ?? tx.destination_account_id}</dd>
            {tx.destination_account && <dd className="text-xs text-gray-500">{tx.destination_account.holder_name}</dd>}
          </div>
          <div>
            <dt className="text-xs text-gray-500">Tipo</dt>
            <dd className="text-gray-800">{TYPE_LABEL[tx.type]}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Monto</dt>
            <dd className="font-semibold text-gray-900">{formatAmount(tx.amount)}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Creada</dt>
            <dd className="text-gray-800">{formatDate(tx.created_at)}</dd>
          </div>
          {tx.updated_at && (
            <div>
              <dt className="text-xs text-gray-500">Actualizada</dt>
              <dd className="text-gray-800">{formatDate(tx.updated_at)}</dd>
            </div>
          )}
        </dl>
      </div>

      {tx.status === 'Pending' && (
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Acciones</h3>
          <ErrorAlert message={error} />
          {confirmAction ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-700">
                {confirmAction === 'Completed' ? '¿Aprobar esta transacción?' : '¿Rechazar esta transacción?'}
              </p>
              <Button
                size="sm"
                variant={confirmAction === 'Completed' ? 'primary' : 'danger'}
                isLoading={isPending}
                onClick={confirm}
              >
                Confirmar
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setConfirmAction(null)}>
                Cancelar
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={() => setConfirmAction('Completed')}>
                Aprobar
              </Button>
              <Button size="sm" variant="danger" onClick={() => setConfirmAction('Rejected')}>
                Rechazar
              </Button>
            </div>
          )}
        </div>
      )}

      <AuditLogSection logsPromise={auditPromise} />
    </div>
  );
}

function AuditLogSection({ logsPromise }: { logsPromise: Promise<AuditLogsResult> }) {
  const result = use(logsPromise);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">Historial de cambios</h3>
      {!result.ok ? (
        <ErrorAlert message={result.error} />
      ) : result.data.length === 0 ? (
        <p className="text-sm text-gray-500">Sin registros de auditoría.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {result.data.map((log) => (
            <li key={log.id} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
              <div>
                <span className="text-gray-700">
                  <Badge variant={STATUS_VARIANT[log.previous_status]}>{STATUS_LABEL[log.previous_status]}</Badge>
                  {' → '}
                  <Badge variant={STATUS_VARIANT[log.new_status]}>{STATUS_LABEL[log.new_status]}</Badge>
                </span>
                <p className="text-xs text-gray-500">
                  {log.performed_by} · {formatDate(log.timestamp)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
