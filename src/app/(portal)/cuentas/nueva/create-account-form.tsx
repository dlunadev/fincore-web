'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';
import { useCreateAccount } from '@/hooks/accounts/use-accounts';
import type { CreateAccountDto } from '@/sdk';

const schema = z.object({
  account_number: z.string().min(1, 'El número de cuenta es requerido'),
  holder_name:    z.string().min(1, 'El titular es requerido'),
  currency:       z.enum(['PEN', 'USD'], { error: 'Seleccione una moneda' }),
  initial_balance: z.coerce.number({ error: 'Ingrese un monto válido' }).min(0, 'El saldo no puede ser negativo'),
});

interface CreateAccountFormProps {
  onSuccess?: () => void;
  onCancel?:  () => void;
}

export function CreateAccountForm({ onSuccess, onCancel }: CreateAccountFormProps = {}) {
  const { create, is_loading, error } = useCreateAccount();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { account_number: '', holder_name: '', currency: 'PEN' as 'PEN' | 'USD', initial_balance: 0 },
  });
  const { register, formState: { errors, isSubmitting } } = form;

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await create(data as unknown as CreateAccountDto);
      onSuccess?.();
    } catch {
      // error surfaced via `error` field
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <ErrorAlert message={error} />

      <Input
        {...register('account_number')}
        id="account_number"
        label="Número de cuenta"
        placeholder="Ej. 001-123456789"
        error={errors.account_number?.message}
        autoFocus
      />

      <Input
        {...register('holder_name')}
        id="holder_name"
        label="Titular"
        placeholder="Nombre completo del titular"
        error={errors.holder_name?.message}
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

      <Input
        {...register('initial_balance')}
        id="initial_balance"
        label="Saldo inicial"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        error={errors.initial_balance?.message}
      />

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" disabled={isSubmitting || is_loading} onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting || is_loading}>
          Crear cuenta
        </Button>
      </div>
    </form>
  );
}
