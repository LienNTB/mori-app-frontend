import * as type from "../../types";

export const getNotificationsRequest = async (userId) => {
  return fetch(`${type.BACKEND_URL}/api/notification/${userId}`, {
    method: "GET",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      console.log("error:", error);
    });
};

export const createNewNotificationRequest = async (
  account,
  post,
  action,
  performedBy,
  message
) => {
  return fetch(`${type.BACKEND_URL}/api/notification`, {
    method: "POST",
    headers: type.requestHeader,
    body: JSON.stringify({
      account,
      post,
      action,
      performedBy,
      message,
    }),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      console.log("error:", error);
    });
};

export const markNotificationaAsReadRequest = async (id) => {
  return fetch(`${type.BACKEND_URL}/api/notification/mark-as-read/${id}`, {
    method: "POST",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      console.log("error:", error);
    });
};
