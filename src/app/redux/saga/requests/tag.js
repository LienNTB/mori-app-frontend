import * as type from "../../types";

export const getAllTagsRequest = async () => {
  return fetch(`${type.BACKEND_URL}/api/tag/get-tags`, {
    method: "GET",
    headers: type.requestHeader,
  })
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
};
export const getTagByIdRequest = async (id) => {
  return fetch(`${type.BACKEND_URL}/api/tag/${id}`, {
    method: "GET",
    headers: type.requestHeader,
  })
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
};
