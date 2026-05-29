'use client';

import { use } from 'react';
import Link from 'next/link';
import { EditAccountForm } from './edit-account-form';

export default function EditAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

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
        <EditAccountForm id={id} />
      </div>

    </div>
  );
}
