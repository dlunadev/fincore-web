'use client';

import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';
import { Input } from '@/components/ui/input';
import { useLogin } from './use-login';

export function LoginForm() {
  const { form, error, is_loading, onSubmit } = useLogin();
  const { register, formState: { errors } } = form;

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">FinCore</h1>
        <p className="mt-1 text-sm text-gray-500">Portal de Gestión de Transacciones</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-800">Iniciar sesión</h2>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <Input
            id="email"
            type="email"
            label="Correo electrónico"
            autoComplete="email"
            placeholder="operaciones@empresa.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="password"
            type="password"
            label="Contraseña"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <ErrorAlert message={error} />

          <Button type="submit" isLoading={is_loading} className="mt-2 w-full">
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
}
