import { call, put } from "redux-saga/effects";
import * as accountRequest from "../requests/account";
import * as types from "../../types";

export function* getAllAccountsHandler() {
  try {
    const accounts = yield call(accountRequest.getAccountsRequest);
    yield put({
      type: types.GET_ACCOUNTS_SUCCESS,
      accounts: accounts.accounts,
    });
  } catch (e) {
    yield put({ type: types.GET_ACCOUNTS_FAILED, message: e.message });
  }
}
export function* createAccountHandler({ payload }) {
  try {
    const account = payload;
    const result = yield call(accountRequest.createAccountRequest, account);
    console.log("result:", result);
    if (result == 0) {
      yield put({
        type: types.CREATE_ACCOUNT_SUCCESS,
        message: "Account added successfully",
      });
    } else {
      yield put({
        type: types.CREATE_ACCOUNT_FAILED,
        message: "Account already exist!",
      });
    }
  } catch (e) {
    yield put({ type: types.CREATE_ACCOUNT_FAILED, message: e.message });
  }
}

export function* getCurrentAccountHandler({ payload }) {
  try {
    const result = yield call(accountRequest.getCurrentAccountRequest, payload);
    let account = result.account;
    if (account !== null) {
      yield put({
        type: types.GET_CURRENT_ACCOUNT_SUCCESS,
        currentAccount: account,
      });
    } else {
      yield put({
        type: types.GET_CURRENT_ACCOUNT_FAILED,
        message: "Account not exist!",
      });
    }
  } catch (e) {
    yield put({
      type: types.GET_CURRENT_ACCOUNT_FAILED,
      message: e.message,
    });
  }
}
