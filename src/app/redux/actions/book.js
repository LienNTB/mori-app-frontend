import * as type from "../types";

export const getBooks = () => ({
  type: type.GET_BOOKS_REQUESTED,
});

export const getBookById = (id) => ({
  type: type.GET_BOOK_REQUESTED,
  payload: id,
});

export const searchBooks = (searchValue) => ({
  type: type.SEARCH_BOOKS_REQUESTED,
  payload: searchValue,
});
