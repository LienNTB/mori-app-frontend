import { all, takeEvery, takeLatest } from "redux-saga/effects";
import accountSaga from "./accountSaga";
import bookSaga from "./bookSaga";
import membershipSaga from "./membershipSaga";
import tagSaga from "./tagSaga";
import myLibrarySaga from "./myLibrarySaga";
import reviewSaga from "./reviewSaga";

export default function* rootSaga() {
  yield all([
    accountSaga(),
    bookSaga(),
    membershipSaga(),
    tagSaga(),
    myLibrarySaga(),
    reviewSaga(),
  ]);
}
