import type { TransactionStatus } from './transaction';

export interface AuditLog {
  id: string;
  transaction_id: string;
  performed_by: string;
  previous_status: TransactionStatus;
  new_status: TransactionStatus;
  timestamp: string;
}
