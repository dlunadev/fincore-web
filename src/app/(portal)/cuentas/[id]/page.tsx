'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EditAccountForm } from './edit-account-form';
import { fetchAccount } from './use-edit-account';
import type { AccountDetailResult } from './use-edit-account';

export default function EditAccountPage({ params }: { params: { id: string } }) {
  const [promise] = useState<Promise<AccountDetailResult>>(() => fetchAccount(params.id));

  return (
    <div className="mx-auto max-w-lg">

      <div className="mb-6 flex items-center gap-3">
        <Link href="/cuentas" className="text-sm text-gray-500 hover:text-gray-700">
          ← Cuentas
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">Editar cuenta</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <Suspense fallback={<div className="flex justify-center py-10"><LoadingSpinner size="lg" /></div>}>
          <EditAccountForm promise={promise} />
        </Suspense>
      </div>

    </div>
  );
}
