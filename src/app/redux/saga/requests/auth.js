import * as type from "../../types";

export const resetPasswordRequest = async (token, password) => {
  const request = {
    token: token,
    password: password,
  };
  return fetch(`${type.BACKEND_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: type.requestHeader,
    credentials: "include",
    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      console.log("error:", error);
    });
};

export const forgetPasswordRequest = async (email) => {
  const request = {
    email: email,
  };
  return fetch(`${type.BACKEND_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: type.requestHeader,
    credentials: "include",
    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      console.log("error:", error);
    });
};
