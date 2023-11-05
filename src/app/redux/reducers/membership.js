import * as type from "../types";

const initialState = {
  loading: false,
  error: null,
};

export default function mmebership(state = initialState, action) {
  switch (action.type) {
    case type.REGISTER_MEMBERSHIP_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    case type.REGISTER_MEMBERSHIP_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case type.REGISTER_MEMBERSHIP_FAILED:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
