import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { getAllAccountsHandler } from "../saga/handlers/account";
import * as handler from "../saga/handlers/book";
import * as type from "../types";

export default function* bookSaga() {
  yield takeEvery(type.GET_BOOKS_REQUESTED, handler.getAllBooksHandler);
  yield takeEvery(type.SEARCH_BOOKS_REQUESTED, handler.searchBooksHandler);
  yield takeEvery(type.GET_BOOK_REQUESTED, handler.getBookByIdHandler);
  yield takeEvery(
    type.INCREASE_TOTAL_READ_REQUESTED,
    handler.increaseTotalReadHandler
  );
  yield takeEvery(
    type.INCREASE_TOTAL_SAVED_REQUESTED,
    handler.increaseTotalSavedHandler
  );
}
