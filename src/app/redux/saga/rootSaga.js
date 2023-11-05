import { all, takeEvery, takeLatest } from "redux-saga/effects";
import accountSaga from "./accountSaga";
import bookSaga from "./bookSaga";
import membershipSaga from "./membershipSaga";

export default function* rootSaga() {
  yield all([accountSaga(), bookSaga(), membershipSaga()]);
}
