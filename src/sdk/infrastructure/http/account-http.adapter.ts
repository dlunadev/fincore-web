import type { IAccountPort, GetAccountsParams } from '../../domain/ports/account.port';
import type { Account, CreateAccountDto, UpdateAccountDto } from '../../domain/models/account';
import type { PagedResult } from '../../domain/models/pagination';
import type { HttpClient } from './http-client';
import { mapPagedResult } from './paged-result-mapper';

export class AccountHttpAdapter implements IAccountPort {
  constructor(private readonly http: HttpClient) {}

  getAll({ search, page = 1, page_size = 10 }: GetAccountsParams = {}): Promise<PagedResult<Account>> {
    const params = new URLSearchParams({
      page:      String(page),
      pageSize:  String(page_size),
      ...(search ? { search } : {}),
    });
    return this.http.get(`/api/accounts?${params}`).then(mapPagedResult<Account>);
  }

  getById(id: string): Promise<Account> {
    return this.http.get<Account>(`/api/accounts/${id}`);
  }

  create(data: CreateAccountDto): Promise<Account> {
    return this.http.post<Account>('/api/accounts', data);
  }

  update(id: string, data: UpdateAccountDto): Promise<Account> {
    return this.http.put<Account>(`/api/accounts/${id}`, data);
  }

  async deactivate(id: string): Promise<void> {
    await this.http.patch(`/api/accounts/${id}/deactivate`);
  }
}
