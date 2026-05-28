export type TransactionType = 'Debit' | 'Credit';
export type TransactionStatus = 'Pending' | 'Completed' | 'Rejected';

export interface TransactionAccount {
  account_number: string;
  holder_name: string;
}

export interface Transaction {
  id: string;
  source_account_id: string;
  destination_account_id: string;
  source_account?: TransactionAccount;
  destination_account?: TransactionAccount;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  created_at: string;
  updated_at?: string;
}

export interface CreateTransactionDto {
  source_account_id: string;
  destination_account_id: string;
  type: TransactionType;
  amount: number;
}

export interface UpdateTransactionStatusDto {
  status: 'Completed' | 'Rejected';
}
