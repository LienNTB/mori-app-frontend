import * as type from "../types";

export const getReviewsById = (id) => ({
  type: type.GET_REVIEWS_BY_ID_REQUESTED,
  payload: id,
});
