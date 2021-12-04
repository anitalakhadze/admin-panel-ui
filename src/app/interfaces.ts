export interface Tokens {
  access_token: string,
  refresh_token: string
}

export interface TransactionDetails {
  userId: number;
  paymentSource: string;
  status: string;
  ecommerceCompanyName: string;
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

export interface User {
  id: number;
  name: string;
  ipAddress: string;
  returnUrl: string;
  isActive: string;
  addedAt: string;
  userRole: string;
}

export interface SearchInfo {
  username: string,
  companyIds: number[];
  startDate: Date;
  endDate: Date;
}
