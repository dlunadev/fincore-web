'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/components/ui/select-field';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAccountsList } from '@/hooks/accounts/use-accounts';
import { useCreateTransaction } from '@/hooks/transactions/use-transactions';
import type { CreateTransactionDto } from '@/sdk';

const schema = z.object({
  source_account_id:      z.string().min(1, 'Seleccione la cuenta origen'),
  destination_account_id: z.string().min(1, 'Seleccione la cuenta destino'),
  type:                   z.enum(['Debit', 'Credit'], { error: 'Seleccione el tipo de transacción' }),
  amount:                 z.coerce
    .number({ error: 'Ingrese un monto válido' })
    .positive('El monto debe ser mayor a 0'),
}).refine(
  (d) => d.source_account_id !== d.destination_account_id,
  { message: 'La cuenta origen y destino no pueden ser la misma', path: ['destination_account_id'] },
);

interface CreateTransactionFormProps {
  onSuccess?: () => void;
  onCancel?:  () => void;
}

export function CreateTransactionForm({ onSuccess, onCancel }: CreateTransactionFormProps = {}) {
  const { accounts, is_loading: loadingAccounts, error: accountsError } =
    useAccountsList({ page: 1, page_size: 100 });
  const activeAccounts = accounts.filter((a) => a.status === 'Active');

  const { create, is_loading, error } = useCreateTransaction();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      source_account_id:      '',
      destination_account_id: '',
      type:                   'Debit' as 'Debit' | 'Credit',
      amount:                 0,
    },
  });
  const { control, register, formState: { errors, isSubmitting } } = form;

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await create(data as unknown as CreateTransactionDto);
      onSuccess?.();
    } catch {
      // error surfaced via `error` field
    }
  });

  const accountOptions = activeAccounts.map((a) => ({
    value: a.id,
    label: `${a.account_number} — ${a.holder_name} (${a.currency})`,
  }));

  const typeOptions = [
    { value: 'Debit',  label: 'Débito'  },
    { value: 'Credit', label: 'Crédito' },
  ];

  if (loadingAccounts) {
    return <div className="flex justify-center py-10"><LoadingSpinner size="lg" /></div>;
  }

  if (accountsError) return <ErrorAlert message={accountsError} />;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <ErrorAlert message={error} />

      <Controller
        name="source_account_id"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Cuenta origen"
            placeholder="Seleccionar cuenta..."
            value={field.value}
            onChange={field.onChange}
            options={accountOptions}
            error={errors.source_account_id?.message}
          />
        )}
      />

      <Controller
        name="destination_account_id"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Cuenta destino"
            placeholder="Seleccionar cuenta..."
            value={field.value}
            onChange={field.onChange}
            options={accountOptions}
            error={errors.destination_account_id?.message}
          />
        )}
      />

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Tipo de transacción"
            value={field.value}
            onChange={field.onChange}
            options={typeOptions}
            error={errors.type?.message}
          />
        )}
      />

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
        <Button type="button" variant="secondary" disabled={isSubmitting || is_loading} onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting || is_loading}>
          Crear transacción
        </Button>
      </div>
    </form>
  );
}
