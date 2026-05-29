import type { ITransactionPort } from '../../domain/ports/transaction.port';
import type { Transaction, GetTransactionsParams } from '../../domain/models/transaction';
import type { PagedResult } from '../../domain/models/pagination';

export class GetTransactionsUseCase {
  constructor(private readonly transactions: ITransactionPort) {}

  execute(params: GetTransactionsParams = {}): Promise<PagedResult<Transaction>> {
    return this.transactions.getAll(params);
  }
}
