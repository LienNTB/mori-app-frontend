import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { getAllAccountsHandler } from "../saga/handlers/account";
import * as handler from "../saga/handlers/account";
import * as types from "../types";
import { GET_ACCOUNTS_REQUESTED } from "../types";

export default function* accountSaga() {
  yield takeEvery(GET_ACCOUNTS_REQUESTED, handler.getAllAccountsHandler);
}
