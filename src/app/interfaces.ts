export interface Tokens {
  access_token: string,
  refresh_token: string
}

export interface TransactionDetails {
  userId: number;
  paymentSource: string;
  status: string;
}

export interface Transaction {
  id: number;
  amount: number;
  commission: number;
  dateCreated: string;
  invoiceData: string;
  details: TransactionDetails;
}

export interface Company {
  id: number;
  companyId: number;
  name: String;
}
