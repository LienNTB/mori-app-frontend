import { all, takeEvery, takeLatest } from "redux-saga/effects";
import accountSaga from "./accountSaga";
import * as type from "../types";
import * as accountHandler from "../saga/handlers/account";
import { GET_ACCOUNTS } from "../types";

export default function* rootSaga() {
  yield all([accountSaga()]);
}
