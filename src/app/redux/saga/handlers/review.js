import { call, put } from "redux-saga/effects";
import * as types from "../../types";
import * as reviewRequest from "../requests/review";

export function* getAllReviewsByIdHandler({ payload }) {
  try {
    const reviews = yield call(reviewRequest.getReviewsByIdRequest, payload);
    yield put({
      type: types.GET_REVIEWS_BY_ID_SUCCESS,
      reviews: reviews.reviews,
    });
  } catch (e) {
    yield put({ type: types.GET_REVIEWS_BY_ID_FAILED, message: e.message });
  }
}
