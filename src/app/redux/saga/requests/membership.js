import * as type from "../../types";

export const registerMembershipRequest = async (membership) => {
  return fetch(`${type.BACKEND_URL}/api/membership/add-membership`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(membership),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const getMembershipByIdRequest = async (userId) => {
  return fetch(`${type.BACKEND_URL}/api/membership/get-membership/${userId}`, {
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
