import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { getAllAccountsHandler } from "../saga/handlers/account";
import * as handler from "../saga/handlers/account";
import * as type from "../types";

export default function* accountSaga() {
  yield takeEvery(type.GET_ACCOUNTS_REQUESTED, handler.getAllAccountsHandler);
  yield takeEvery(type.CREATE_ACCOUNT_REQUESTED, handler.createAccountHandler);
  yield takeEvery(
    type.GET_CURRENT_ACCOUNT_REQUESTED,
    handler.getCurrentAccountHandler
  );
}
