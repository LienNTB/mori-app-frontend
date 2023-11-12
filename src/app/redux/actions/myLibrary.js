import * as type from "../types";

export const getBooksFromMyLibrary = (userId) => ({
  type: type.GET_BOOKS_FROM_LIBRARY_REQUESTED,
  payload: userId,
});
export const addBookToLibrary = (request) => ({
  type: type.ADD_BOOK_TO_LIBRARY_REQUESTED,
  payload: request,
});
export const deleteBookFromLibrary = (request) => ({
  type: type.DELETE_BOOK_FROM_LIBRARY_REQUESTED,
  payload: request,
});
