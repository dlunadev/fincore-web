import type { IAccountPort } from '../../domain/ports/account.port';
import type { Account, UpdateAccountDto } from '../../domain/models/account';

export class UpdateAccountUseCase {
  constructor(private readonly accounts: IAccountPort) {}

  execute(id: string, data: UpdateAccountDto): Promise<Account> {
    return this.accounts.update(id, data);
  }
}
