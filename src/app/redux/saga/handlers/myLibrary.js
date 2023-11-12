import { call, put } from "redux-saga/effects";
import * as type from "../../types";
import * as request from "../requests/myLibrary";

export function* getBooksFromMyLibraryHandler({ payload }) {
  try {
    const result = yield call(request.getBooksFromMyLibraryRequest, payload);
    console.log("result:", result);
    yield put({
      type: type.GET_BOOKS_FROM_LIBRARY_SUCCESS,
      payload: result.myLibrary,
    });
  } catch (e) {
    yield put({
      type: type.GET_BOOKS_FROM_LIBRARY_FAILED,
      payload: e,
    });
  }
}

export function* addBookToLibraryHandler({ payload }) {
  try {
    const result = yield call(request.addBookToLibraryRequest, payload);
    console.log("result:", result);
    if (result === 0) {
      yield put({
        type: type.ADD_BOOK_TO_LIBRARY_SUCCESS,
        payload: result,
      });
    }
    if (result === 1) {
      yield put({
        type: type.ADD_BOOK_TO_LIBRARY_FAILED,
        payload: result,
      });
    }
  } catch (e) {
    yield put({
      type: type.ADD_BOOK_TO_LIBRARY_FAILED,
      payload: e,
    });
  }
}

export function* deleteBookFromLibraryHandler({ payload }) {
  try {
    const result = yield call(request.deleteBookFromLibraryRequest, payload);
    console.log("result:", result);
    if (result === 0) {
      yield put({
        type: type.DELETE_BOOK_FROM_LIBRARY_SUCCESS,
        payload: result,
      });
    }
    if (result === 1) {
      yield put({
        type: type.DELETE_BOOK_FROM_LIBRARY_FAILED,
        payload: result,
      });
    }
  } catch (e) {
    yield put({
      type: type.ADD_BOOK_TO_LIBRARY_FAILED,
      payload: e,
    });
  }
}
