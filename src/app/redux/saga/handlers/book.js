import { call, put } from "redux-saga/effects";
import * as bookRequest from "../requests/book";
import * as types from "../../types";
import searchBooksRequest from "../requests/book";
import { useSelector } from "react-redux";
import store from "../../store";
import { stringify } from "postcss";
export function* getAllBooksHandler() {
  try {
    const books = yield call(bookRequest.getAllBooksRequest);
    yield put({
      type: types.GET_BOOKS_SUCCESS,
      books: books.books,
    });
  } catch (e) {
    yield put({ type: types.GET_BOOKS_FAILED, message: e.message });
  }
}

export function* searchBooksHandler({ type, payload }) {
  let books = store.getState().books.books;
  try {
    let filteredBooks = books.filter((item) => {
      if (
        item.author.toLowerCase().includes(payload.toString()) ||
        item.name.toLowerCase().includes(payload.toString())
      )
        return item;
    });

    yield put({
      type: types.SEARCH_BOOKS_SUCCESS,
      filteredBooks: filteredBooks,
    });

    console.log("filteredBooks:", store.getState().books.filteredBooks);
  } catch (e) {
    yield put({ type: types.SEARCH_BOOKS_FAILED, message: e.message });
  }
}
