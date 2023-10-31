import * as type from "../types";

const initialState = {
  accounts: [],
  currentAccount: null,
  loading: false,
  error: null,
};

export default function accounts(state = initialState, action) {
  switch (action.type) {
    case type.GET_ACCOUNTS_REQUESTED:
    case type.CREATE_ACCOUNT_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    case type.GET_ACCOUNTS_SUCCESS:
      return {
        ...state,
        loading: false,
        accounts: action.accounts,
      };
    case type.CREATE_ACCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        accounts: action.accounts,
      };
    case type.GET_CURRENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        currentAccount:action.currentAccount
      }
    case type.GET_ACCOUNTS_FAILED:
    case type.CREATE_ACCOUNT_FAILED:
    case type.GET_CURRENT_ACCOUNT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message,
      };
  
    default:
      return state;
  }
}
