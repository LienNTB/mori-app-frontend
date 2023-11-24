import * as type from "../types";
import * as handler from "../saga/handlers/myLibrary";
import { takeEvery } from "redux-saga/effects";

export default function* myLibrarySaga() {
  yield takeEvery(
    type.GET_BOOKS_FROM_LIBRARY_REQUESTED,
    handler.getBooksFromMyLibraryHandler
  );
  yield takeEvery(
    type.ADD_BOOK_TO_LIBRARY_REQUESTED,
    handler.addBookToLibraryHandler
  );
  yield takeEvery(
    type.DELETE_BOOK_FROM_LIBRARY_REQUESTED,
    handler.deleteBookFromLibraryHandler
  );
}
