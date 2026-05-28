import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import { accountsService } from '@/services/accounts.service';
import { ApiError } from '@/services/api';
import type { Account } from '@/models';

const schema = z.object({
  holder_name: z.string().min(1, 'El titular es requerido'),
  currency:    z.enum(['PEN', 'USD'], { error: 'Seleccione una moneda' }),
});

type EditAccountFormData = z.infer<typeof schema>;

export type AccountDetailResult =
  | { ok: true;  data: Account }
  | { ok: false; error: string };

export function fetchAccount(id: string): Promise<AccountDetailResult> {
  return accountsService
    .getById(id)
    .then((data) => ({ ok: true as const, data }))
    .catch((err) => ({
      ok: false as const,
      error: err instanceof ApiError ? err.message : 'Error al cargar la cuenta.',
    }));
}

export function useEditAccount(account: Account) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EditAccountFormData>({
    resolver: zodResolver(schema),
    defaultValues: { holder_name: account.holder_name, currency: account.currency as 'PEN' | 'USD' },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setError(null);
    try {
      await accountsService.update(account.id, data);
      router.replace('/cuentas');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al actualizar la cuenta.');
    }
  });

  return { form, error, is_loading: form.formState.isSubmitting, onSubmit };
}

export function useDeactivateAccount(account: Account) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const deactivate = () => {
    setError(null);
    startTransition(async () => {
      try {
        await accountsService.deactivate(account.id);
        router.replace('/cuentas');
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Error al desactivar la cuenta.');
      }
    });
  };

  return { showConfirm, setShowConfirm, deactivating: isPending, deactivateError: error, deactivate };
}
