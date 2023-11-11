import { combineReducers } from "redux";
import accounts from "./account";
import books from "./book";
import memberships from "./membership";

const rootReducer = combineReducers({
  accounts: accounts,
  books: books,
  memberships: memberships,
});
export default rootReducer;
