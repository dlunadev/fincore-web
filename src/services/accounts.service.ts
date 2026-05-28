import { api } from './api';
import type { Account, CreateAccountDto, UpdateAccountDto, PaginatedResponse } from '@/models';

interface GetAccountsParams {
  search?:    string;
  page?:      number;
  page_size?: number;
}

export const accountsService = {
  getAll: ({ search, page = 1, page_size = 10 }: GetAccountsParams = {}) => {
    const params = new URLSearchParams({
      page:      String(page),
      page_size: String(page_size),
      ...(search ? { search } : {}),
    });
    return api.get<PaginatedResponse<Account>>(`/api/accounts?${params}`);
  },

  getById: (id: string) =>
    api.get<Account>(`/api/accounts/${id}`),

  create: (data: CreateAccountDto) =>
    api.post<Account>('/api/accounts', data),

  update: (id: string, data: UpdateAccountDto) =>
    api.put<Account>(`/api/accounts/${id}`, data),

  deactivate: (id: string) =>
    api.patch<Account>(`/api/accounts/${id}/deactivate`, {}),
};
