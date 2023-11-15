import * as type from "../../types";

export const registerMembershipRequest = async (membership) => {
  return fetch(`${type.BACKEND_URL}/api/membership/add-membership`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
