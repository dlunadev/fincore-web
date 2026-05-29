'use client';

import { use } from 'react';
import Link from 'next/link';
import { TransactionDetail } from './transaction-detail';

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="mx-auto max-w-2xl">

      <div className="mb-6 flex items-center gap-3">
        <Link href="/transacciones" className="text-sm text-gray-500 hover:text-gray-700">
          ← Transacciones
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">Detalle</h1>
      </div>

      <TransactionDetail id={id} />

    </div>
  );
}
