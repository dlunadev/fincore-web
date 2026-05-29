'use client';

import useSWRMutation from 'swr/mutation';
import { fincore } from '@/sdk';
import type { LoginCredentials } from '@/sdk';

export function useLogin() {
  const { trigger, isMutating, error } = useSWRMutation(
    'auth/login',
    (_key: string, { arg }: { arg: LoginCredentials }) =>
      fincore.auth.login.execute(arg),
  );

  return {
    login:      trigger,
    is_loading: isMutating,
    error:      error?.message ?? null,
  };
}
