import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import * as handler from "../saga/handlers/comment";
import * as type from "../types";

export default function* commentSaga() {
  yield takeEvery(
    type.GET_ALL_COMMENTS_REQUESTED,
    handler.getAllCommentsHandler
  );
  yield takeEvery(
    type.CREATE_NEW_COMMENT_REQUESTED,
    handler.createNewCommentHandler
  );
}
