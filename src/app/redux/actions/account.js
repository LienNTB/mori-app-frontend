import * as type from "../types";

export const getAccounts = () => ({
  type: type.GET_ACCOUNTS_REQUESTED,
});
export const createNewAccount = (account) => ({
  type: type.CREATE_ACCOUNT_REQUESTED,
  payload: account,
});
export const getCurrentAccount = (accountInfo) => ({
  type: type.GET_CURRENT_ACCOUNT_REQUESTED,
  payload: accountInfo,
});
