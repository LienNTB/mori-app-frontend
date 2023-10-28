import * as type from "../types";

export const getBooks = () => ({
  type: type.GET_BOOKS_REQUESTED,
});

export const searchBooks = (searchValue) => ({
  type: type.SEARCH_BOOKS_REQUESTED,
  payload: searchValue,
});
