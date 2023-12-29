// token
export const TOKEN_ENDPOINT = "/token";

// shared
export const DASHBOARD_ENDPOINT = "/dashboard";
export const LOGIN_ENDPOINT = "/login";

// users
export const USERS_ENDPOINT = "/users";
export const USERS_EXCEL_ENDPOINT = USERS_ENDPOINT + "/excel";
export const CHANGE_PASSWORD_ENDPOINT = USERS_ENDPOINT + "/password";

// transactions
export const TRANSACTIONS_ENDPOINT = "/transactions";
export const FILTERED_TRANSACTIONS_ENDPOINT = TRANSACTIONS_ENDPOINT + "/filtered";
export const FILTERED_TRANSACTIONS_EXCEL_ENDPOINT = FILTERED_TRANSACTIONS_ENDPOINT + "/excel";

// companies
export const COMPANIES_ENDPOINT = "/companies";
export const INACTIVE_COMPANIES_ENDPOINT = COMPANIES_ENDPOINT + "?status=INACTIVE";
export const ACTIVE_COMPANIES_ENDPOINT = COMPANIES_ENDPOINT + "?status=ACTIVE";

