import type { ITransactionPort } from '../../domain/ports/transaction.port';
import type { Transaction, CreateTransactionDto, GetTransactionsParams, UpdateTransactionStatus } from '../../domain/models/transaction';
import type { AuditLog } from '../../domain/models/audit-log';
import type { PagedResult } from '../../domain/models/pagination';
import type { HttpClient } from './http-client';
import { mapPagedResult } from './paged-result-mapper';

export class TransactionHttpAdapter implements ITransactionPort {
  constructor(private readonly http: HttpClient) {}

  getAll({ status, type, from, to, page = 1, page_size = 10 }: GetTransactionsParams = {}): Promise<PagedResult<Transaction>> {
    const params = new URLSearchParams({
      page:     String(page),
      pageSize: String(page_size),
      ...(status ? { status } : {}),
      ...(type   ? { type }   : {}),
      ...(from   ? { from }   : {}),
      ...(to     ? { to }     : {}),
    });
    return this.http.get(`/api/transactions?${params}`).then(mapPagedResult<Transaction>);
  }

  getById(id: string): Promise<Transaction> {
    return this.http.get<Transaction>(`/api/transactions/${id}`);
  }

  create(data: CreateTransactionDto): Promise<Transaction> {
    return this.http.post<Transaction>('/api/transactions', data);
  }

  updateStatus(id: string, status: UpdateTransactionStatus): Promise<Transaction> {
    const action = status === 'Completed' ? 'complete' : 'reject';
    return this.http.patch<Transaction>(`/api/transactions/${id}/${action}`);
  }

  getAuditLogs(id: string): Promise<AuditLog[]> {
    return this.http.get<AuditLog[]>(`/api/transactions/${id}/audit`);
  }
}
