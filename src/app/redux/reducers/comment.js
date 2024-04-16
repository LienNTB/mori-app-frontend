import * as type from "../types";

const initialState = {
  comments: [],
  loading: false,
  error: null,
  message: "",
};

export default function comments(state = initialState, action) {
  switch (action.type) {
    case type.GET_ALL_COMMENTS_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    case type.GET_ALL_COMMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        comments: action.comments,
      };
    case type.CREATE_NEW_COMMENT_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    case type.CREATE_NEW_COMMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.message,
      };
    case type.GET_ALL_COMMENTS_FAILED:
    case type.CREATE_NEW_COMMENT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message,
      };
    case type.SET_COMMENTS:
      return {
        ...state,
        comments: action.payload,
      };
    default:
      return state;
  }
}
