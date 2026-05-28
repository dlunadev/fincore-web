import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/services/api';

const loginSchema = z.object({
  email:    z.string().email('Ingrese un email válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setError(null);
    try {
      const response = await authService.login(data);
      login(response.token, response.user);
      router.replace(searchParams.get('from') ?? '/cuentas');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al iniciar sesión.');
    }
  });

  return {
    form,
    error,
    is_loading: form.formState.isSubmitting,
    onSubmit,
  };
}
