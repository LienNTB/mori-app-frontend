import * as type from "../types";

export const registerMembership = (membership) => ({
  type: type.REGISTER_MEMBERSHIP_REQUESTED,
  payload: membership,
});
export const getMembershipById = (userId) => ({
  type: type.GET_MEMBERSHIP_BY_ID_REQUESTED,
  payload: userId,
});
