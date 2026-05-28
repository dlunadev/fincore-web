'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useAccounts } from './use-accounts';
import { AccountSearch } from './account-search';
import { AccountsTable } from './accounts-table';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function CuentasPage() {
  const vm = useAccounts();

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Cuentas</h1>
        <Link href="/cuentas/nueva">
          <Button size="sm">+ Nueva cuenta</Button>
        </Link>
      </div>

      <AccountSearch value={vm.search} onChange={vm.handleSearch} />

      <Suspense fallback={<div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>}>
        <AccountsTable
          promise={vm.promise}
          is_pending={vm.is_pending}
          page={vm.page}
          confirmId={vm.confirmId}
          deactivating={vm.deactivating}
          deactivateError={vm.deactivateError}
          onPage={vm.handlePage}
          onDeactivate={vm.setConfirmId}
          onConfirm={vm.deactivate}
          onCancel={() => vm.setConfirmId(null)}
        />
      </Suspense>

    </div>
  );
}
