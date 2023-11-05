import * as type from "../types";

export const registerMembership = (membership) => ({
  type: type.REGISTER_MEMBERSHIP_REQUESTED,
  payload: membership,
});
