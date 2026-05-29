import type { ITransactionPort } from '../../domain/ports/transaction.port';
import type { Transaction, CreateTransactionDto } from '../../domain/models/transaction';

export class CreateTransactionUseCase {
  constructor(private readonly transactions: ITransactionPort) {}

  execute(data: CreateTransactionDto): Promise<Transaction> {
    if (data.amount <= 0)
      return Promise.reject(new Error('El monto debe ser mayor a 0.'));
    if (data.source_account_id === data.destination_account_id)
      return Promise.reject(new Error('La cuenta origen y destino no pueden ser la misma.'));
    return this.transactions.create(data);
  }
}
