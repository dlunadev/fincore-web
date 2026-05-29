import type { IAccountPort } from '../../domain/ports/account.port';
import type { Account } from '../../domain/models/account';

export class GetAccountUseCase {
  constructor(private readonly accounts: IAccountPort) {}

  execute(id: string): Promise<Account> {
    return this.accounts.getById(id);
  }
}
