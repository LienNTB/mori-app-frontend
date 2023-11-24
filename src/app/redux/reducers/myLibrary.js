import * as type from "../types";

const initialState = {
  bookList: [],
  loading: false,
  error: null,
  message: "",
};

export default function myLibrary(state = initialState, action) {
  switch (action.type) {
    case type.GET_BOOKS_FROM_LIBRARY_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    case type.GET_BOOKS_FROM_LIBRARY_SUCCESS:
      return {
        ...state,
        loading: false,
        bookList: action.payload,
      };
    case type.GET_BOOKS_FROM_LIBRARY_FAILED:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case type.ADD_BOOK_TO_LIBRARY_SUCCESS:
    case type.ADD_BOOK_TO_LIBRARY_FAILED:
    case type.DELETE_BOOK_FROM_LIBRARY_SUCCESS:
    case type.DELETE_BOOK_FROM_LIBRARY_FAILED:
      return {
        ...state,
        message: action.payload,
      };

    default:
      return state;
  }
}
