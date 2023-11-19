import * as type from "../types";

export const getBooks = () => ({
  type: type.GET_BOOKS_REQUESTED,
});

export const getBooksByCate = (cate) => ({
  type: type.GET_BOOKS_BY_CATEGORY_REQUESTED,
  payload: cate,
});

export const getBookById = (id) => ({
  type: type.GET_BOOK_REQUESTED,
  payload: id,
});

export const searchBooks = (searchValue) => ({
  type: type.SEARCH_BOOKS_REQUESTED,
  payload: searchValue,
});

export const increaseTotalRead = (id) => ({
  type: type.INCREASE_TOTAL_READ_REQUESTED,
  payload: id,
});
export const increaseTotalSaved = (bookId, accountId) => ({
  type: type.INCREASE_TOTAL_SAVED_REQUESTED,

  bookId: bookId,
  accountId: accountId,
});
