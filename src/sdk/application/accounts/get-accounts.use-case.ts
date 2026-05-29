import type { IAccountPort, GetAccountsParams } from '../../domain/ports/account.port';
import type { Account } from '../../domain/models/account';
import type { PagedResult } from '../../domain/models/pagination';

export class GetAccountsUseCase {
  constructor(private readonly accounts: IAccountPort) {}

  execute(params: GetAccountsParams = {}): Promise<PagedResult<Account>> {
    return this.accounts.getAll(params);
  }
}
