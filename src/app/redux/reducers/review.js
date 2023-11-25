import * as type from "../types";

const initialState = {
  reviews: [],
  loading: false,
  error: null,
};

export default function reviews(state = initialState, action) {
  switch (action.type) {
    case type.GET_REVIEWS_BY_ID_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    case type.GET_REVIEWS_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        reviews: action.reviews,
      };
    case type.GET_REVIEWS_BY_ID_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message,
      };
    default:
      return state;
  }
}
