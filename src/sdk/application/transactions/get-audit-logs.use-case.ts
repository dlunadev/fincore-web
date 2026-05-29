import type { ITransactionPort } from '../../domain/ports/transaction.port';
import type { AuditLog } from '../../domain/models/audit-log';

export class GetAuditLogsUseCase {
  constructor(private readonly transactions: ITransactionPort) {}

  execute(transactionId: string): Promise<AuditLog[]> {
    return this.transactions.getAuditLogs(transactionId);
  }
}
