import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { getAllAccountsHandler } from "../saga/handlers/account";
import * as handler from "../saga/handlers/review";
import * as type from "../types";

export default function* reviewSaga() {
  yield takeEvery(
    type.GET_REVIEWS_BY_ID_REQUESTED,
    handler.getAllReviewsByIdHandler
  );
}
