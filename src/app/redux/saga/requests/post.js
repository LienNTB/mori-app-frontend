import * as type from "../../types";

export const getAllPostRequest = async () => {
  return fetch(`${type.BACKEND_URL}/api/post`, {
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

export const createNewPostRequest = async (postRequest) => {
  return fetch(`${type.BACKEND_URL}/api/post/`, {
    method: "POST",
    headers: type.requestHeader,

    body: JSON.stringify(postRequest),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
export const deletePostById = async (postId) => {
  return fetch(`${type.BACKEND_URL}/api/post/${postId}`, {
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

export const getPostById = async (postId) => {
  return fetch(`${type.BACKEND_URL}/api/post/${postId}`, {
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
