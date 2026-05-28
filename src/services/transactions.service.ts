import { api } from './api';
import type { Transaction, CreateTransactionDto, UpdateTransactionStatusDto, PaginatedResponse, AuditLog } from '@/models';

interface GetTransactionsParams {
  page?:      number;
  page_size?: number;
  status?:    string;
  type?:      string;
}

export const transactionsService = {
  getAll: ({ page = 1, page_size = 10, status, type }: GetTransactionsParams = {}) => {
    const params = new URLSearchParams({
      page:      String(page),
      page_size: String(page_size),
      ...(status ? { status } : {}),
      ...(type   ? { type }   : {}),
    });
    return api.get<PaginatedResponse<Transaction>>(`/api/transactions?${params}`);
  },

  getById: (id: string) =>
    api.get<Transaction>(`/api/transactions/${id}`),

  create: (data: CreateTransactionDto) =>
    api.post<Transaction>('/api/transactions', data),

  updateStatus: (id: string, data: UpdateTransactionStatusDto) =>
    api.patch<Transaction>(`/api/transactions/${id}/status`, data),

  getAuditLogs: (id: string) =>
    api.get<AuditLog[]>(`/api/transactions/${id}/audit-logs`),
};
