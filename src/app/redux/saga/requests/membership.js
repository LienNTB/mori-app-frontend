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
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const updateMembershipStatusRequest = async (userId, isMember) => {
  return fetch(
    `${type.BACKEND_URL}/api/account/update-membership-status/${userId}`,
    {
      method: "PUT",
      headers: type.requestHeader,
      body: JSON.stringify({
        is_member: isMember,
      }),
    }
  )
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const createMembershipWillBeOutdatedNotificationRequest = async (
  userId,
  membership
) => {
  return fetch(
    `${type.BACKEND_URL}/api/notification/notify-membership-outdated/${userId}`,
    {
      method: "POST",
      headers: type.requestHeader,
      body: JSON.stringify({
        account: userId,
        membership: membership,
      }),
    }
  )
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
