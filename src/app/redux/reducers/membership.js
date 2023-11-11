import * as type from "../types";

const initialState = {
  loading: false,
  error: null,
  message: "",
};

export default function mebership(state = initialState, action) {
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
        message: action.message,
      };

    case type.REGISTER_MEMBERSHIP_FAILED:
      return {
        ...state,
        loading: false,
        message: action.message,
      };

    default:
      return state;
  }
}
