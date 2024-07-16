import * as type from "../../types";

export const getAllMembershipTypeRequest = async () => {
  return fetch(`${type.BACKEND_URL}/api/membershipType/membership-types`, {
    method: "GET",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const registerMembershipRequest = async (membership) => {
  return fetch(`${type.BACKEND_URL}/api/membership/add-membership`, {
    method: "POST",
    headers: type.getRequestHeader(),
    credentials: 'include',
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
    headers: type.getRequestHeader(),
    credentials: 'include',
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
