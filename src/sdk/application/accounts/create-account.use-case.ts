import type { IAccountPort } from '../../domain/ports/account.port';
import type { Account, CreateAccountDto } from '../../domain/models/account';

export class CreateAccountUseCase {
  constructor(private readonly accounts: IAccountPort) {}

  execute(data: CreateAccountDto): Promise<Account> {
    if (data.initial_balance < 0)
      return Promise.reject(new Error('El saldo inicial no puede ser negativo.'));
    return this.accounts.create(data);
  }
}
