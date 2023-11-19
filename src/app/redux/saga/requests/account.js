import * as type from "../../types";
export const getAccountsRequest = async (searchValue) => {
  return fetch(`${type.BACKEND_URL}/api/account/get-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      searchValue: searchValue,
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
};
export const createAccountRequest = async (account) => {
  return fetch(`${type.BACKEND_URL}/api/account/add-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  })
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
};

export const getCurrentAccountRequest = async (account) => {
  return fetch(`${type.BACKEND_URL}/api/account/find-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  })
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
};

export const registerAccountRequest = async (account) => {
  return fetch(`${type.BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  })
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
};

export const loginAccountRequest = async (account) => {
  return fetch(`${type.BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  })
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
};
