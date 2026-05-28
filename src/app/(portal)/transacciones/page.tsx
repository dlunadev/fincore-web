'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useTransactions } from './use-transactions';
import { TransactionFilters } from './transaction-filters';
import { TransactionsTable } from './transactions-table';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function TransaccionesPage() {
  const vm = useTransactions();

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transacciones</h1>
        <Link href="/transacciones/nueva">
          <Button size="sm">+ Nueva transacción</Button>
        </Link>
      </div>

      <TransactionFilters
        status={vm.status}
        type={vm.type}
        onStatus={vm.handleStatus}
        onType={vm.handleType}
      />

      <Suspense fallback={<div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>}>
        <TransactionsTable
          promise={vm.promise}
          is_pending={vm.is_pending}
          page={vm.page}
          onPage={vm.handlePage}
        />
      </Suspense>

    </div>
  );
}
