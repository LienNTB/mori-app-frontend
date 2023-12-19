import * as type from "../types";

export const getTags = () => ({
  type: type.GET_TAGS_REQUESTED,
});
export const getTagById = (id) => {
  return {
    type: type.GET_TAG_REQUESTED,
    payload: id,
  };
};
