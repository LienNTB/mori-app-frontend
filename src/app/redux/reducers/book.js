import * as type from "../types";

const initialState = {
  books: [],
  booksByCate: null,
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
    case type.GET_BOOK_REQUESTED:
    case type.GET_BOOKS_BY_CATEGORY_REQUESTED:
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
    case type.GET_BOOKS_BY_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        booksByCate: action.books,
      };
    case type.GET_BOOK_SUCCESS:
      return {
        ...state,
        loading: false,
        book: action.book,
      };

    case type.GET_BOOKS_FAILED:
    case type.GET_BOOK_FAILED:
    case type.GET_BOOKS_BY_CATEGORY_FAILED:
    case type.SEARCH_BOOKS_FAILED:
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
