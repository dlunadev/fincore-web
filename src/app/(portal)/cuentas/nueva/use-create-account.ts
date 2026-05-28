import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { accountsService } from '@/services/accounts.service';
import { ApiError } from '@/services/api';
import { useState } from 'react';

const schema = z.object({
  account_number: z.string().min(1, 'El número de cuenta es requerido'),
  holder_name:    z.string().min(1, 'El titular es requerido'),
  currency:       z.enum(['PEN', 'USD'], { error: 'Seleccione una moneda' }),
  balance:        z.coerce.number({ error: 'Ingrese un monto válido' }).min(0, 'El saldo no puede ser negativo'),
});

type CreateAccountFormData = z.infer<typeof schema>;

export function useCreateAccount() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateAccountFormData>({
    resolver: zodResolver(schema),
    defaultValues: { account_number: '', holder_name: '', currency: 'PEN', balance: 0 },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setError(null);
    try {
      await accountsService.create(data);
      router.replace('/cuentas');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al crear la cuenta.');
    }
  });

  return { form, error, is_loading: form.formState.isSubmitting, onSubmit };
}
