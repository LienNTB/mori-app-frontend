import { combineReducers } from "redux";
import accounts from "./account";
import books from "./book";
import memberships from "./membership";
import myLibrary from "./myLibrary";
import reviews from "./review";
import comments from "./comment";

const rootReducer = combineReducers({
  accounts: accounts,
  books: books,
  memberships: memberships,
  myLibrary: myLibrary,
  reviews: reviews,
  comments: comments,
});
export default rootReducer;
