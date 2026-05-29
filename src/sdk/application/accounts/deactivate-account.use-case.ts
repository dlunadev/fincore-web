import type { IAccountPort } from '../../domain/ports/account.port';

export class DeactivateAccountUseCase {
  constructor(private readonly accounts: IAccountPort) {}

  execute(id: string): Promise<void> {
    return this.accounts.deactivate(id);
  }
}
