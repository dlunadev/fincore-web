'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTransactionsList } from '@/hooks/transactions/use-transactions';
import { TransactionFilters } from './transaction-filters';
import { TransactionsTable } from './transactions-table';
import { Button } from '@/components/ui/button';
import type { TransactionStatus, TransactionType } from '@/sdk';

export default function TransaccionesPage() {
  const [status, setStatus] = useState<TransactionStatus | ''>('');
  const [type, setType]     = useState<TransactionType | ''>('');
  const [page, setPage]     = useState(1);

  const { transactions, total, total_pages, is_loading, error } = useTransactionsList({
    status:    status   || undefined,
    type:      type     || undefined,
    page,
  });

  const handleStatus = (value: string) => {
    setStatus(value as TransactionStatus | '');
    setPage(1);
  };

  const handleType = (value: string) => {
    setType(value as TransactionType | '');
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transacciones</h1>
        <Link href="/transacciones/nueva">
          <Button size="sm">+ Nueva transacción</Button>
        </Link>
      </div>

      <TransactionFilters
        status={status}
        type={type}
        onStatus={handleStatus}
        onType={handleType}
      />

      <TransactionsTable
        transactions={transactions}
        total={total}
        total_pages={total_pages}
        page={page}
        is_loading={is_loading}
        error={error}
        onPage={setPage}
      />

    </div>
  );
}
