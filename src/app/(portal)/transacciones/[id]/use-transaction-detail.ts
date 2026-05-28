import { useState, useTransition } from 'react';
import { transactionsService } from '@/services/transactions.service';
import { ApiError } from '@/services/api';
import type { Transaction, AuditLog } from '@/models';

export type TransactionDetailResult =
  | { ok: true;  data: Transaction }
  | { ok: false; error: string };

export type AuditLogsResult =
  | { ok: true;  data: AuditLog[] }
  | { ok: false; error: string };

export function fetchTransactionDetail(id: string): Promise<TransactionDetailResult> {
  return transactionsService
    .getById(id)
    .then((data) => ({ ok: true as const, data }))
    .catch((err) => ({
      ok: false as const,
      error: err instanceof ApiError ? err.message : 'Error al cargar la transacción.',
    }));
}

export function fetchAuditLogs(id: string): Promise<AuditLogsResult> {
  return transactionsService
    .getAuditLogs(id)
    .then((data) => ({ ok: true as const, data }))
    .catch((err) => ({
      ok: false as const,
      error: err instanceof ApiError ? err.message : 'Error al cargar el historial.',
    }));
}

export function useUpdateStatus(transaction: Transaction, onSuccess: () => void) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<'Completed' | 'Rejected' | null>(null);

  const confirm = () => {
    if (!confirmAction) return;
    setError(null);
    startTransition(async () => {
      try {
        await transactionsService.updateStatus(transaction.id, { status: confirmAction });
        setConfirmAction(null);
        onSuccess();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Error al actualizar el estado.');
        setConfirmAction(null);
      }
    });
  };

  return { isPending, error, confirmAction, setConfirmAction, confirm };
}
