export type AccountStatus = 'Active' | 'Inactive';

export interface Account {
  id: string;
  account_number: string;
  holder_name: string;
  currency: string;
  balance: number;
  status: AccountStatus;
  created_at: string;
}

export interface CreateAccountDto {
  account_number: string;
  holder_name: string;
  currency: string;
  balance: number;
}

export interface UpdateAccountDto {
  holder_name: string;
  currency: string;
}
