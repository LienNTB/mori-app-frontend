import * as type from "../types";

export const getAccounts = () => ({
  type: type.GET_ACCOUNTS_REQUESTED,
});

// export const getAccountsSuccess = (payload) => (dispatch) => ({
//   type: type.GET_ACCOUNTS_SUCCESS,
//   payload: payload.accounts,
// });

// export const getAccountsFailed = (payload) => (dispatch) => ({
//   type: type.GET_ACCOUNTS_FAILED,
//   payload: payload.message,
// });
