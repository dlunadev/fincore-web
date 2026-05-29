'use client';

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { fincore } from '@/sdk';
import type { GetAccountsParams } from '@/sdk';
import type { CreateAccountDto, UpdateAccountDto } from '@/sdk';

// ── Cache keys ────────────────────────────────────────────────────
const ACCOUNTS_KEY = (params: GetAccountsParams) =>
  ['accounts', params] as const;

const ACCOUNT_KEY = (id: string) => ['accounts', id] as const;

// ── List ─────────────────────────────────────────────────────────
export function useAccountsList(params: GetAccountsParams = {}) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ACCOUNTS_KEY(params),
    () => fincore.accounts.getAll.execute(params),
    { keepPreviousData: true },
  );

  return {
    accounts:     data?.data ?? [],
    total:        data?.total ?? 0,
    total_pages:  data?.total_pages ?? 1,
    page:         data?.page ?? 1,
    is_loading:   isLoading,
    is_validating: isValidating,
    error:        error?.message ?? null,
    refresh:      () => mutate(),
  };
}

// ── Detail ───────────────────────────────────────────────────────
export function useAccount(id: string) {
  const { data, error, isLoading } = useSWR(
    ACCOUNT_KEY(id),
    () => fincore.accounts.getById.execute(id),
  );

  return {
    account:    data ?? null,
    is_loading: isLoading,
    error:      error?.message ?? null,
  };
}

// ── Create ───────────────────────────────────────────────────────
export function useCreateAccount() {
  const { trigger, isMutating, error } = useSWRMutation(
    'accounts/create',
    (_key: string, { arg }: { arg: CreateAccountDto }) =>
      fincore.accounts.create.execute(arg),
  );

  return {
    create:     trigger,
    is_loading: isMutating,
    error:      error?.message ?? null,
  };
}

// ── Update ───────────────────────────────────────────────────────
export function useUpdateAccount(id: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    ['accounts/update', id],
    (_key: unknown, { arg }: { arg: UpdateAccountDto }) =>
      fincore.accounts.update.execute(id, arg),
  );

  return {
    update:     trigger,
    is_loading: isMutating,
    error:      error?.message ?? null,
  };
}

// ── Deactivate ───────────────────────────────────────────────────
export function useDeactivateAccount() {
  const { trigger, isMutating, error } = useSWRMutation(
    'accounts/deactivate',
    (_key: string, { arg }: { arg: string }) =>
      fincore.accounts.deactivate.execute(arg),
  );

  return {
    deactivate: (id: string) => trigger(id),
    is_loading: isMutating,
    error:      error?.message ?? null,
  };
}
