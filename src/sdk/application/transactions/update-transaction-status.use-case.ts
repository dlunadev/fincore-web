import type { ITransactionPort } from '../../domain/ports/transaction.port';
import type { Transaction, UpdateTransactionStatus } from '../../domain/models/transaction';

export class UpdateTransactionStatusUseCase {
  constructor(private readonly transactions: ITransactionPort) {}

  execute(id: string, status: UpdateTransactionStatus): Promise<Transaction> {
    return this.transactions.updateStatus(id, status);
  }
}
