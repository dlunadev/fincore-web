import { HttpClient } from './infrastructure/http/http-client';
import { AuthHttpAdapter } from './infrastructure/http/auth-http.adapter';
import { AccountHttpAdapter } from './infrastructure/http/account-http.adapter';
import { TransactionHttpAdapter } from './infrastructure/http/transaction-http.adapter';
import { CookieTokenStorage } from './infrastructure/storage/cookie-token.storage';

import { LoginUseCase } from './application/auth/login.use-case';
import { GetAccountsUseCase } from './application/accounts/get-accounts.use-case';
import { GetAccountUseCase } from './application/accounts/get-account.use-case';
import { CreateAccountUseCase } from './application/accounts/create-account.use-case';
import { UpdateAccountUseCase } from './application/accounts/update-account.use-case';
import { DeactivateAccountUseCase } from './application/accounts/deactivate-account.use-case';
import { GetTransactionsUseCase } from './application/transactions/get-transactions.use-case';
import { GetTransactionUseCase } from './application/transactions/get-transaction.use-case';
import { CreateTransactionUseCase } from './application/transactions/create-transaction.use-case';
import { UpdateTransactionStatusUseCase } from './application/transactions/update-transaction-status.use-case';
import { GetAuditLogsUseCase } from './application/transactions/get-audit-logs.use-case';

export interface SDKConfig {
  baseUrl: string;
}

export interface FincoreSDK {
  auth: {
    login: LoginUseCase;
  };
  accounts: {
    getAll:     GetAccountsUseCase;
    getById:    GetAccountUseCase;
    create:     CreateAccountUseCase;
    update:     UpdateAccountUseCase;
    deactivate: DeactivateAccountUseCase;
  };
  transactions: {
    getAll:       GetTransactionsUseCase;
    getById:      GetTransactionUseCase;
    create:       CreateTransactionUseCase;
    updateStatus: UpdateTransactionStatusUseCase;
    getAuditLogs: GetAuditLogsUseCase;
  };
}

export function createFincoreSDK(config: SDKConfig): FincoreSDK {
  const tokenStorage = new CookieTokenStorage();
  const http         = new HttpClient(config.baseUrl, tokenStorage);

  const authAdapter        = new AuthHttpAdapter(http);
  const accountAdapter     = new AccountHttpAdapter(http);
  const transactionAdapter = new TransactionHttpAdapter(http);

  return {
    auth: {
      login: new LoginUseCase(authAdapter),
    },
    accounts: {
      getAll:     new GetAccountsUseCase(accountAdapter),
      getById:    new GetAccountUseCase(accountAdapter),
      create:     new CreateAccountUseCase(accountAdapter),
      update:     new UpdateAccountUseCase(accountAdapter),
      deactivate: new DeactivateAccountUseCase(accountAdapter),
    },
    transactions: {
      getAll:       new GetTransactionsUseCase(transactionAdapter),
      getById:      new GetTransactionUseCase(transactionAdapter),
      create:       new CreateTransactionUseCase(transactionAdapter),
      updateStatus: new UpdateTransactionStatusUseCase(transactionAdapter),
      getAuditLogs: new GetAuditLogsUseCase(transactionAdapter),
    },
  };
}
