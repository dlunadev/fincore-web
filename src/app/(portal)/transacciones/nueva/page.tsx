'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CreateTransactionForm } from './create-transaction-form';
import { fetchActiveAccounts } from './use-create-transaction';
import type { AccountsForSelectResult } from './use-create-transaction';

export default function NuevaTransaccionPage() {
  const [promise] = useState<Promise<AccountsForSelectResult>>(() => fetchActiveAccounts());

  return (
    <div className="mx-auto max-w-lg">

      <div className="mb-6 flex items-center gap-3">
        <Link href="/transacciones" className="text-sm text-gray-500 hover:text-gray-700">
          ← Transacciones
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">Nueva transacción</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <Suspense fallback={<div className="flex justify-center py-10"><LoadingSpinner size="lg" /></div>}>
          <CreateTransactionForm promise={promise} />
        </Suspense>
      </div>

    </div>
  );
}
