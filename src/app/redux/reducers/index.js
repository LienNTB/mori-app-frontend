import { combineReducers } from "redux";
import accounts from "./account";

const rootReducer = combineReducers({
  accounts: accounts,
});
export default rootReducer;
