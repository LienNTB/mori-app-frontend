import * as type from "../types";

const initialState = {
  books: [],
  book: null,
  filteredBooks: [],
  searchValue: "",
  loading: false,
  error: null,
};

export default function books(state = initialState, action) {
  switch (action.type) {
    // get books
    case type.GET_BOOKS_REQUESTED:
    case type.SEARCH_BOOKS_REQUESTED:
    case type.GET_BOOK_REQUESTED:
      console.log("requestted");
      return {
        ...state,
        loading: true,
      };
    case type.GET_BOOKS_SUCCESS:
      return {
        ...state,
        loading: false,
        books: action.books,
      };
    case type.GET_BOOK_SUCCESS:
      console.log("success");

      return {
        ...state,
        loading: false,
        book: action.book,
      };
    case type.GET_BOOKS_FAILED:
    case type.GET_BOOK_FAILED:
    case type.SEARCH_BOOKS_FAILED:
      console.log("failed");
      return {
        ...state,
        loading: false,
        error: action.message,
      };

    case type.SEARCH_BOOKS_SUCCESS:
      return {
        ...state,
        loading: false,
        filteredBooks: action.filteredBooks,
      };

    default:
      return state;
  }
}
