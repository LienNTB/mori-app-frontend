import * as type from "../types";

const initialState = {
  tags: [],
  tag: null,
  loading: false,
  error: null,
};

export default function tags(state = initialState, action) {
  switch (action.type) {
    case type.GET_TAGS_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    case type.GET_TAG_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    case type.GET_TAGS_SUCCESS:
      return {
        ...state,
        loading: false,
        tags: action.tags,
      };
    case type.GET_TAG_SUCCESS:

      return {
        ...state,
        loading: false,
        tag: action.tag,
      };
    case type.GET_TAGS_FAILED:
    case type.GET_TAG_FAILED:

      return {
        ...state,
        loading: false,
        error: action.message,
      };
    default:
      return state;
  }
}
