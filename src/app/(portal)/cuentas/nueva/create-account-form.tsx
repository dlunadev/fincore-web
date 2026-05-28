'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';
import { useCreateAccount } from './use-create-account';

export function CreateAccountForm() {
  const { form, error, is_loading, onSubmit } = useCreateAccount();
  const { register, formState: { errors } } = form;

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
        {...register('balance')}
        id="balance"
        label="Saldo inicial"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        error={errors.balance?.message}
      />

      <div className="flex items-center justify-end gap-3 pt-2">
        <Link href="/cuentas">
          <Button type="button" variant="secondary" disabled={is_loading}>
            Cancelar
          </Button>
        </Link>
        <Button type="submit" isLoading={is_loading}>
          Crear cuenta
        </Button>
      </div>
    </form>
  );
}
