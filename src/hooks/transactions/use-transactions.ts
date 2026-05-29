'use client';

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { fincore } from '@/sdk';
import type { GetTransactionsParams, CreateTransactionDto, UpdateTransactionStatus } from '@/sdk';

// ── Cache keys ────────────────────────────────────────────────────
const TRANSACTIONS_KEY = (params: GetTransactionsParams) =>
  ['transactions', params] as const;

const TRANSACTION_KEY = (id: string) => ['transactions', id] as const;

const AUDIT_LOGS_KEY = (id: string) => ['transactions', id, 'audit'] as const;

// ── List ─────────────────────────────────────────────────────────
export function useTransactionsList(params: GetTransactionsParams = {}) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    TRANSACTIONS_KEY(params),
    () => fincore.transactions.getAll.execute(params),
    { keepPreviousData: true },
  );

  return {
    transactions:  data?.data ?? [],
    total:         data?.total ?? 0,
    total_pages:   data?.total_pages ?? 1,
    page:          data?.page ?? 1,
    is_loading:    isLoading,
    is_validating: isValidating,
    error:         error?.message ?? null,
    refresh:       () => mutate(),
  };
}

// ── Detail ───────────────────────────────────────────────────────
export function useTransaction(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    TRANSACTION_KEY(id),
    () => fincore.transactions.getById.execute(id),
  );

  return {
    transaction: data ?? null,
    is_loading:  isLoading,
    error:       error?.message ?? null,
    refresh:     () => mutate(),
  };
}

// ── Create ───────────────────────────────────────────────────────
export function useCreateTransaction() {
  const { trigger, isMutating, error } = useSWRMutation(
    'transactions/create',
    (_key: string, { arg }: { arg: CreateTransactionDto }) =>
      fincore.transactions.create.execute(arg),
  );

  return {
    create:     trigger,
    is_loading: isMutating,
    error:      error?.message ?? null,
  };
}

// ── Update status (complete / reject) ────────────────────────────
export function useUpdateTransactionStatus(id: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    ['transactions/status', id],
    (_key: unknown, { arg }: { arg: UpdateTransactionStatus }) =>
      fincore.transactions.updateStatus.execute(id, arg),
  );

  return {
    updateStatus: trigger,
    is_loading:   isMutating,
    error:        error?.message ?? null,
  };
}

// ── Audit logs ───────────────────────────────────────────────────
export function useAuditLogs(transactionId: string) {
  const { data, error, isLoading } = useSWR(
    AUDIT_LOGS_KEY(transactionId),
    () => fincore.transactions.getAuditLogs.execute(transactionId),
  );

  return {
    logs:       data ?? [],
    is_loading: isLoading,
    error:      error?.message ?? null,
  };
}
