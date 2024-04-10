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
export const deletePostByIdRequest = async (postId) => {
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

export const getPostByIdRequest = async (postId) => {
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
export const getPostByUserIdRequest = async (userId) => {
  return fetch(`${type.BACKEND_URL}/api/post/${userId}`, {
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
