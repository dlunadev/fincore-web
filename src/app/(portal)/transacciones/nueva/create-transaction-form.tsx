'use client';

import { use } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';
import { useCreateTransaction } from './use-create-transaction';
import type { AccountsForSelectResult } from './use-create-transaction';

interface CreateTransactionFormProps {
  promise: Promise<AccountsForSelectResult>;
}

export function CreateTransactionForm({ promise }: CreateTransactionFormProps) {
  const result = use(promise);

  if (!result.ok) return <ErrorAlert message={result.error} />;

  return <CreateTransactionFormInner accounts={result.data} />;
}

function CreateTransactionFormInner({ accounts }: { accounts: import('@/models').Account[] }) {
  const { form, error, is_loading, onSubmit } = useCreateTransaction(accounts);
  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <ErrorAlert message={error} />

      <Select
        {...register('source_account_id')}
        id="source_account_id"
        label="Cuenta origen"
        error={errors.source_account_id?.message}
      >
        <option value="">Seleccionar cuenta...</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.account_number} — {a.holder_name} ({a.currency})
          </option>
        ))}
      </Select>

      <Select
        {...register('destination_account_id')}
        id="destination_account_id"
        label="Cuenta destino"
        error={errors.destination_account_id?.message}
      >
        <option value="">Seleccionar cuenta...</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.account_number} — {a.holder_name} ({a.currency})
          </option>
        ))}
      </Select>

      <Select
        {...register('type')}
        id="type"
        label="Tipo de transacción"
        error={errors.type?.message}
      >
        <option value="Debit">Débito</option>
        <option value="Credit">Crédito</option>
      </Select>

      <Input
        {...register('amount')}
        id="amount"
        label="Monto"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
        error={errors.amount?.message}
      />

      <div className="flex items-center justify-end gap-3 pt-2">
        <Link href="/transacciones">
          <Button type="button" variant="secondary" disabled={is_loading}>
            Cancelar
          </Button>
        </Link>
        <Button type="submit" isLoading={is_loading}>
          Crear transacción
        </Button>
      </div>
    </form>
  );
}
