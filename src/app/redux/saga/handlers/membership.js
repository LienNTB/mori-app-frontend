import * as membershipRequest from "../requests/membership";
import * as type from "../../types";
import { toast } from "react-toastify";
import { call, put } from "redux-saga/effects";

export function* registerMembershipHandler({ payload }) {
  try {
    const result = yield call(
      membershipRequest.registerMembershipRequest,
      payload
    );
    yield put({
      type: type.REGISTER_MEMBERSHIP_SUCCESS,
      message: result,
    });
  } catch (e) {
    yield put({
      type: type.REGISTER_MEMBERSHIP_FAILED,
      message: result,
    });
  }
}
