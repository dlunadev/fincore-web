'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ErrorAlert } from '@/components/ui/error-alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  useAccount,
  useUpdateAccount,
  useDeactivateAccount,
} from '@/hooks/accounts/use-accounts';

const schema = z.object({
  holder_name: z.string().min(1, 'El titular es requerido'),
  currency:    z.enum(['PEN', 'USD'], { error: 'Seleccione una moneda' }),
});

type EditAccountFormData = z.infer<typeof schema>;

function formatBalance(amount: number, currency: string) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency', currency, minimumFractionDigits: 2,
  }).format(amount);
}

export function EditAccountForm({ id, onClose, onSuccess }: { id: string; onClose?: () => void; onSuccess?: () => void }) {
  const router  = useRouter();
  const { account, is_loading, error } = useAccount(id);
  const { update, is_loading: updating, error: updateError } = useUpdateAccount(id);
  const { deactivate, is_loading: deactivating, error: deactivateError } = useDeactivateAccount();
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<EditAccountFormData>({
    resolver: zodResolver(schema),
    values: account ? { holder_name: account.holder_name, currency: account.currency as 'PEN' | 'USD' } : undefined,
  });
  const { register, formState: { errors, isSubmitting } } = form;

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await update(data);
      if (onSuccess) { onSuccess(); } else { router.replace('/cuentas'); }
    } catch {
      // error shown via updateError
    }
  });

  const handleDeactivate = async () => {
    try {
      await deactivate(id);
      if (onSuccess) { onSuccess(); } else { router.replace('/cuentas'); }
    } catch {
      // error shown via deactivateError
    }
  };

  if (is_loading) {
    return <div className="flex justify-center py-10"><LoadingSpinner size="lg" /></div>;
  }

  if (error) return <ErrorAlert message={error} />;
  if (!account) return null;

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
        <ErrorAlert message={updateError} />

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
          <Button type="button" variant="secondary" disabled={isSubmitting || updating} onClick={() => onClose ? onClose() : router.replace('/cuentas')}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting || updating}>
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
              <Button size="sm" variant="danger" isLoading={deactivating} onClick={handleDeactivate}>
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
