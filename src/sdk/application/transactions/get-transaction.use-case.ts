import type { ITransactionPort } from '../../domain/ports/transaction.port';
import type { Transaction } from '../../domain/models/transaction';

export class GetTransactionUseCase {
  constructor(private readonly transactions: ITransactionPort) {}

  execute(id: string): Promise<Transaction> {
    return this.transactions.getById(id);
  }
}
