import { takeEvery } from "redux-saga/effects";
import * as handler from "../saga/handlers/membership";
import * as type from "../types";

export default function* membershipSaga() {
  yield takeEvery(
    type.REGISTER_MEMBERSHIP_REQUESTED,
    handler.registerMembershipHandler
  );
}
