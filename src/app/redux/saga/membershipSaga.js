import { takeEvery } from "redux-saga/effects";
import * as handler from "../saga/handlers/membership";
import * as type from "../types";

export default function* membershipSaga() {
  yield takeEvery(
    type.REGISTER_MEMBERSHIP_REQUESTED,
    handler.registerMembershipHandler
  );
  yield takeEvery(
    type.GET_MEMBERSHIP_BY_ID_REQUESTED,
    handler.getMembershipByIdHandler
  );
}
