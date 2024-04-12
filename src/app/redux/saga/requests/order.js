import * as type from "../../types";

export const orderRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/order/create`, {
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


export const orderPaymentRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/order/create_payment_url`, {
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