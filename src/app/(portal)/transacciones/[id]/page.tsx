'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TransactionDetail } from './transaction-detail';
import { fetchTransactionDetail, fetchAuditLogs } from './use-transaction-detail';
import type { TransactionDetailResult, AuditLogsResult } from './use-transaction-detail';

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  const [txPromise]   = useState<Promise<TransactionDetailResult>>(() => fetchTransactionDetail(params.id));
  const [logsPromise] = useState<Promise<AuditLogsResult>>(() => fetchAuditLogs(params.id));

  return (
    <div className="mx-auto max-w-2xl">

      <div className="mb-6 flex items-center gap-3">
        <Link href="/transacciones" className="text-sm text-gray-500 hover:text-gray-700">
          ← Transacciones
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">Detalle</h1>
      </div>

      <Suspense fallback={<div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>}>
        <TransactionDetail txPromise={txPromise} logsPromise={logsPromise} />
      </Suspense>

    </div>
  );
}
