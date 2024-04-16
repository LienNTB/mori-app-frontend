import * as type from "../../types";

export const addNewCommentRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/comment`, {
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
export const getAllCommentsRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/comment/user`, {
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
export const replyCommentRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/comment/reply`, {
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
