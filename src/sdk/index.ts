import { createFincoreSDK } from './bootstrap';

export { createFincoreSDK } from './bootstrap';
export type { FincoreSDK, SDKConfig } from './bootstrap';
export { SdkError } from './infrastructure/http/http-client';

// Domain models & types
export type { Account, AccountStatus, CreateAccountDto, UpdateAccountDto } from './domain/models/account';
export type { Transaction, TransactionType, TransactionStatus, TransactionAccount, CreateTransactionDto, GetTransactionsParams, UpdateTransactionStatus } from './domain/models/transaction';
export type { AuditLog } from './domain/models/audit-log';
export type { AuthUser, LoginCredentials, LoginResult } from './domain/models/auth';
export type { PagedResult, PageParams } from './domain/models/pagination';

// Port interfaces (for testing / custom implementations)
export type { IAuthPort } from './domain/ports/auth.port';
export type { IAccountPort, GetAccountsParams } from './domain/ports/account.port';
export type { ITransactionPort } from './domain/ports/transaction.port';
export type { ITokenStorage } from './domain/ports/token-storage.port';

// Singleton — pre-built instance using env configuration
export const fincore = createFincoreSDK({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5108',
});
