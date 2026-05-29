import type { Transaction, CreateTransactionDto, GetTransactionsParams, UpdateTransactionStatus } from '../models/transaction';
import type { AuditLog } from '../models/audit-log';
import type { PagedResult } from '../models/pagination';

export interface ITransactionPort {
  getAll(params: GetTransactionsParams): Promise<PagedResult<Transaction>>;
  getById(id: string): Promise<Transaction>;
  create(data: CreateTransactionDto): Promise<Transaction>;
  updateStatus(id: string, status: UpdateTransactionStatus): Promise<Transaction>;
  getAuditLogs(id: string): Promise<AuditLog[]>;
}
