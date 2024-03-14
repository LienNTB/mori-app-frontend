import * as type from "../../types";

export const getBookCategoryRequest = async () => {
  return fetch(`${type.BACKEND_URL}/api/bookCategory/get-categories`, {
    method: "GET",
    headers: type.requestHeader,
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
