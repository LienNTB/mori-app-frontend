import * as membershipRequest from "../requests/membership";
import * as type from "../../types";
import { toast } from "react-toastify";
import { call, put } from "redux-saga/effects";

export function* registerMembershipHandler({ payload }) {
  console.log("registerMembershipHandler");
  try {
    yield call(membershipRequest.registerMembershipRequest, payload);
    yield put({
      type: type.REGISTER_MEMBERSHIP_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: type.REGISTER_MEMBERSHIP_FAILED,
      message: e.message,
    });
  }
}
