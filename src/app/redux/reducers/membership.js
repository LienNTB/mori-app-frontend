import * as type from "../types";

const initialState = {
  membership: null,
  loading: false,
  error: null,
  message: "",
};

export default function membership(state = initialState, action) {
  switch (action.type) {
    case type.REGISTER_MEMBERSHIP_REQUESTED:
    case type.GET_MEMBERSHIP_BY_ID_REQUESTED:
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
    case type.GET_MEMBERSHIP_BY_ID_SUCCESS:
      return {
        ...state,
        membership: action.payload,
        loading: false,
        message: action.message,
      };

    case type.REGISTER_MEMBERSHIP_FAILED:
    case type.GET_MEMBERSHIP_BY_ID_FAILED:
      return {
        ...state,
        loading: false,
        message: action.message,
      };

    default:
      return state;
  }
}
