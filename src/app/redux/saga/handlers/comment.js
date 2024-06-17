import { call, put } from "redux-saga/effects";
import * as types from "../../types";
import * as commentRequest from "../requests/comment";

export function* getAllCommentsHandler({ payload }) {
  try {
    const comments = yield call(commentRequest.getAllCommentsRequest, payload);
    yield put({
      type: types.GET_ALL_COMMENTS_SUCCESS,
      comments: comments.data,
    });
  } catch (e) {
    yield put({ type: types.GET_ALL_COMMENTS_FAILED, message: e.message });
  }
}

export function* createNewCommentHandler({ payload }) {
  try {
    const comments = yield call(commentRequest.addNewCommentRequest, payload);
    yield put({
      type: types.CREATE_NEW_COMMENT_SUCCESS,
      comments: comments.data,
    });
  } catch (e) {
    yield put({ type: types.CREATE_NEW_COMMENT_FAILED, message: e.error });
  }
}
