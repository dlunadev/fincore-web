import { useState, useCallback, useTransition } from 'react';
import { transactionsService } from '@/services/transactions.service';
import { ApiError } from '@/services/api';
import type { Transaction, PaginatedResponse } from '@/models';

const PAGE_SIZE = 10;

export type TransactionsResult =
  | { ok: true;  data: PaginatedResponse<Transaction> }
  | { ok: false; error: string };

function fetchTransactions(status: string, type: string, page: number): Promise<TransactionsResult> {
  return transactionsService
    .getAll({ status: status || undefined, type: type || undefined, page, page_size: PAGE_SIZE })
    .then((data) => ({ ok: true as const, data }))
    .catch((err) => ({
      ok: false as const,
      error: err instanceof ApiError ? err.message : 'Error al cargar las transacciones.',
    }));
}

export function useTransactions() {
  const [promise, setPromise]        = useState<Promise<TransactionsResult>>(() => fetchTransactions('', '', 1));
  const [status, setStatus]          = useState('');
  const [type, setType]              = useState('');
  const [page, setPage]              = useState(1);
  const [isPending, startTransition] = useTransition();

  const reload = useCallback((s: string, t: string, p: number) => {
    startTransition(() => setPromise(fetchTransactions(s, t, p)));
  }, []);

  const handleStatus = useCallback((value: string) => {
    setStatus(value);
    setPage(1);
    reload(value, type, 1);
  }, [type, reload]);

  const handleType = useCallback((value: string) => {
    setType(value);
    setPage(1);
    reload(status, value, 1);
  }, [status, reload]);

  const handlePage = useCallback((newPage: number) => {
    setPage(newPage);
    reload(status, type, newPage);
  }, [status, type, reload]);

  return {
    promise,
    is_pending: isPending,
    status,
    type,
    page,
    handleStatus,
    handleType,
    handlePage,
  };
}
