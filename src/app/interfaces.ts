export interface Tokens {
  access_token: string,
  refresh_token: string
}

export interface TransactionDetails {
  userId: number;
  status: number;
}

export interface Transaction {
  id: number;
  amount: number;
  commission: number;
  dateCreated: string;
  invoiceData: string;
  details: TransactionDetails;
}
