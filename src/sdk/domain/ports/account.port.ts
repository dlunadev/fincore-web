import type { Account, CreateAccountDto, UpdateAccountDto } from '../models/account';
import type { PagedResult, PageParams } from '../models/pagination';

export interface GetAccountsParams extends PageParams {
  search?: string;
}

export interface IAccountPort {
  getAll(params: GetAccountsParams): Promise<PagedResult<Account>>;
  getById(id: string): Promise<Account>;
  create(data: CreateAccountDto): Promise<Account>;
  update(id: string, data: UpdateAccountDto): Promise<Account>;
  deactivate(id: string): Promise<void>;
}
