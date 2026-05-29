'use client';

import { useState } from 'react';
import { useTransactionsList } from '@/hooks/transactions/use-transactions';
import { TransactionFilters } from './transaction-filters';
import { TransactionsTable } from './transactions-table';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { CreateTransactionForm } from './nueva/create-transaction-form';
import { TransactionDetail } from './[id]/transaction-detail';
import type { TransactionStatus, TransactionType } from '@/sdk';

export default function TransaccionesPage() {
  const [status, setStatus]     = useState<TransactionStatus | ''>('');
  const [type, setType]         = useState<TransactionType | ''>('');
  const [page, setPage]         = useState(1);
  const [showNew, setShowNew]   = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  const { transactions, total, total_pages, is_loading, error, refresh } = useTransactionsList({
    status: status || undefined,
    type:   type   || undefined,
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
        <Button size="sm" onClick={() => setShowNew(true)}>+ Nueva transacción</Button>
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
        onDetail={setDetailId}
      />

      <Dialog open={showNew} title="Nueva transacción" onClose={() => setShowNew(false)} size="md">
        <CreateTransactionForm
          onSuccess={() => { setShowNew(false); refresh(); }}
          onCancel={() => setShowNew(false)}
        />
      </Dialog>

      <Dialog open={!!detailId} title="Detalle de transacción" onClose={() => setDetailId(null)} size="lg">
        {detailId && <TransactionDetail id={detailId} />}
      </Dialog>

    </div>
  );
}
