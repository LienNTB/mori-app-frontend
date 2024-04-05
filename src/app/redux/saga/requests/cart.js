import * as type from "../../types";

export const addBooktoCartRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/cart/add-cartitem`, {
    method: "POST",
    headers: type.requestHeader,
    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log("error:", error);
    });
};

export const cartOfCustomerRequest = async (id) => {
  return fetch(`${type.BACKEND_URL}/api/cart/get-cartitem/${id}`, {
    method: "GET",
    headers: type.requestHeader,
  })
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
};

export const updateCartItemQuantityRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/cart/update-quantity`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log("error:", error);
    });
};

export const deleteBookFromCartRequest = async (id) => {
  return fetch(`${type.BACKEND_URL}/api/cart/deletebook/${id}`, {
    method: "DELETE",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};
