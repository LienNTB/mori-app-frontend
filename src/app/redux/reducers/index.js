import { combineReducers } from "redux";
import accounts from "./account";
import books from "./book";
import memberships from "./membership";
import myLibrary from "./myLibrary";

const rootReducer = combineReducers({
  accounts: accounts,
  books: books,
  memberships: memberships,
  myLibrary: myLibrary,
});
export default rootReducer;
