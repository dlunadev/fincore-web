'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAccountsList, useDeactivateAccount } from '@/hooks/accounts/use-accounts';
import { AccountSearch } from './account-search';
import { AccountsTable } from './accounts-table';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';

export default function CuentasPage() {
  const [search, setSearch]       = useState('');
  const [query, setQuery]         = useState('');
  const [page, setPage]           = useState(1);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const debounceRef               = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { accounts, total, total_pages, is_loading, error, refresh } =
    useAccountsList({ search: query, page });

  const { deactivate, is_loading: deactivating, error: deactivateError } =
    useDeactivateAccount();

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setQuery(value);
    }, 400);
  }, []);

  const handlePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleConfirm = async () => {
    if (!confirmId) return;
    await deactivate(confirmId);
    setConfirmId(null);
    refresh();
  };

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Cuentas</h1>
        <Link href="/cuentas/nueva">
          <Button size="sm">+ Nueva cuenta</Button>
        </Link>
      </div>

      <AccountSearch value={search} onChange={handleSearch} />

      <ErrorAlert message={error} />

      <AccountsTable
        accounts={accounts}
        total={total}
        total_pages={total_pages}
        page={page}
        is_loading={is_loading}
        confirmId={confirmId}
        deactivating={deactivating}
        deactivateError={deactivateError}
        onPage={handlePage}
        onDeactivate={setConfirmId}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmId(null)}
      />

    </div>
  );
}
