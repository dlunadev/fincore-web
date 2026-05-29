import type { ITransactionPort } from '../../domain/ports/transaction.port';
import type { Transaction, CreateTransactionDto, GetTransactionsParams, UpdateTransactionStatus } from '../../domain/models/transaction';
import type { AuditLog } from '../../domain/models/audit-log';
import type { PagedResult } from '../../domain/models/pagination';
import type { HttpClient } from './http-client';

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
    return this.http.get<PagedResult<Transaction>>(`/api/transactions?${params}`);
  }

  getById(id: string): Promise<Transaction> {
    return this.http.get<Transaction>(`/api/transactions/${id}`);
  }

  create(data: CreateTransactionDto): Promise<Transaction> {
    return this.http.post<Transaction>('/api/transactions', data);
  }

  updateStatus(id: string, status: UpdateTransactionStatus): Promise<Transaction> {
    return this.http.patch<Transaction>(`/api/transactions/${id}/status`, { status });
  }

  getAuditLogs(id: string): Promise<AuditLog[]> {
    return this.http.get<AuditLog[]>(`/api/transactions/${id}/audit-logs`);
  }
}
