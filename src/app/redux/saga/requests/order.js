import * as type from "../../types";

export const orderRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/order`, {
    method: "POST",
    headers: type.requestHeader,
    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};
