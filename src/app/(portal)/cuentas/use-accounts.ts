import { useState, useCallback, useRef, useTransition } from 'react';
import { accountsService } from '@/services/accounts.service';
import { ApiError } from '@/services/api';
import type { Account, PaginatedResponse } from '@/models';

const PAGE_SIZE = 10;

export type AccountsResult =
  | { ok: true;  data: PaginatedResponse<Account> }
  | { ok: false; error: string };

function fetchAccounts(search: string, page: number): Promise<AccountsResult> {
  return accountsService
    .getAll({ search, page, page_size: PAGE_SIZE })
    .then((data)  => ({ ok: true  as const, data }))
    .catch((err)  => ({
      ok: false as const,
      error: err instanceof ApiError ? err.message : 'Error al cargar las cuentas.',
    }));
}

export function useAccounts() {
  const [promise, setPromise]         = useState<Promise<AccountsResult>>(() => fetchAccounts('', 1));
  const [search, setSearch]           = useState('');
  const [page, setPage]               = useState(1);
  const [isPending, startTransition]  = useTransition();
  const [confirmId, setConfirmId]     = useState<string | null>(null);
  const [deactivating, setDeactivating]     = useState(false);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reload = useCallback((s: string, p: number) => {
    startTransition(() => setPromise(fetchAccounts(s, p)));
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      reload(value, 1);
    }, 400);
  }, [reload]);

  const handlePage = useCallback((newPage: number) => {
    setPage(newPage);
    reload(search, newPage);
  }, [search, reload]);

  const deactivate = async () => {
    if (!confirmId) return;
    setDeactivating(true);
    setDeactivateError(null);
    try {
      await accountsService.deactivate(confirmId);
      setConfirmId(null);
      reload(search, page);
    } catch (err) {
      setDeactivateError(err instanceof ApiError ? err.message : 'Error al desactivar la cuenta.');
    } finally {
      setDeactivating(false);
    }
  };

  return {
    promise,
    is_pending: isPending,
    search,
    handleSearch,
    page,
    handlePage,
    confirmId,
    setConfirmId,
    deactivating,
    deactivateError,
    deactivate,
  };
}
