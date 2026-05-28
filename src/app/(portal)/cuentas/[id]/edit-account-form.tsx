'use client';

import Link from 'next/link';
import { use } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ErrorAlert } from '@/components/ui/error-alert';
import { useEditAccount, useDeactivateAccount } from './use-edit-account';
import type { AccountDetailResult } from './use-edit-account';

function formatBalance(amount: number, currency: string) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency', currency, minimumFractionDigits: 2,
  }).format(amount);
}

interface EditAccountFormProps {
  promise: Promise<AccountDetailResult>;
}

export function EditAccountForm({ promise }: EditAccountFormProps) {
  const result = use(promise);

  if (!result.ok) return <ErrorAlert message={result.error} />;

  const account = result.data;

  return <EditAccountFormInner account={account} />;
}

function EditAccountFormInner({ account }: { account: import('@/models').Account }) {
  const { form, error, is_loading, onSubmit } = useEditAccount(account);
  const { register, formState: { errors } } = form;
  const { showConfirm, setShowConfirm, deactivating, deactivateError, deactivate } = useDeactivateAccount(account);

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-gray-500">Número de cuenta</p>
            <p className="font-mono text-sm font-medium text-gray-900">{account.account_number}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Saldo actual</p>
            <p className="text-sm font-semibold text-gray-900">{formatBalance(account.balance, account.currency)}</p>
          </div>
        </div>
        <Badge variant={account.status === 'Active' ? 'success' : 'neutral'}>
          {account.status === 'Active' ? 'Activa' : 'Inactiva'}
        </Badge>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <ErrorAlert message={error} />

        <Input
          {...register('holder_name')}
          id="holder_name"
          label="Titular"
          placeholder="Nombre completo del titular"
          error={errors.holder_name?.message}
          autoFocus
        />

        <Select
          {...register('currency')}
          id="currency"
          label="Moneda"
          error={errors.currency?.message}
        >
          <option value="PEN">PEN — Sol peruano</option>
          <option value="USD">USD — Dólar americano</option>
        </Select>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/cuentas">
            <Button type="button" variant="secondary" disabled={is_loading}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" isLoading={is_loading}>
            Guardar cambios
          </Button>
        </div>
      </form>

      {account.status === 'Active' && (
        <div className="border-t border-gray-200 pt-4">
          <ErrorAlert message={deactivateError} />
          {showConfirm ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-700">¿Desactivar esta cuenta?</p>
              <Button size="sm" variant="danger" isLoading={deactivating} onClick={deactivate}>
                Sí, desactivar
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setShowConfirm(false)}>
                Cancelar
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="text-sm text-red-600 hover:bg-red-50"
              onClick={() => setShowConfirm(true)}
            >
              Desactivar cuenta
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
