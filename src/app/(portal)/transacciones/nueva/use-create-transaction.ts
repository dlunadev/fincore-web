import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { transactionsService } from '@/services/transactions.service';
import { accountsService } from '@/services/accounts.service';
import { ApiError } from '@/services/api';
import type { Account } from '@/models';

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

type CreateTransactionFormData = z.infer<typeof schema>;

export type AccountsForSelectResult =
  | { ok: true;  data: Account[] }
  | { ok: false; error: string };

export function fetchActiveAccounts(): Promise<AccountsForSelectResult> {
  return accountsService
    .getAll({ page: 1, page_size: 100 })
    .then((res) => ({ ok: true as const, data: res.data.filter((a) => a.status === 'Active') }))
    .catch((err) => ({
      ok: false as const,
      error: err instanceof ApiError ? err.message : 'Error al cargar las cuentas.',
    }));
}

export function useCreateTransaction(accounts: Account[]) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateTransactionFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      source_account_id:      '',
      destination_account_id: '',
      type:                   'Debit',
      amount:                 0,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setError(null);
    try {
      await transactionsService.create(data);
      router.replace('/transacciones');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al crear la transacción.');
    }
  });

  return { form, error, is_loading: form.formState.isSubmitting, onSubmit, accounts };
}
