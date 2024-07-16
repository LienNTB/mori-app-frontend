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
  return fetch(`${type.BACKEND_URL}/api/post`, {
    method: "POST",
    headers: type.getRequestHeader(),
    credentials: 'include',
    body: JSON.stringify(postRequest),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
export const editPostRequest = async (postRequest, id) => {
  return fetch(`${type.BACKEND_URL}/api/post/${id}`, {
    method: "PUT",
    headers: type.getRequestHeader(),
    credentials: 'include',
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
  return fetch(`${type.BACKEND_URL}/api/post/user/${userId}`, {
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

export const uploadPostImageRequest = async (image) => {
  const formData = new FormData();
  formData.append("image", image);
  return fetch(`${type.BACKEND_URL}/api/post/upload-image`, {
    method: "POST",
    headers: {
      Origin: type.FRONTEND_URL_DEV,
    },

    body: formData,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const likePostRequest = async (postId, accountId) => {
  return fetch(`${type.BACKEND_URL}/api/post/${postId}/like`, {
    method: "POST",
    headers: type.requestHeader,
    body: JSON.stringify({
      accountId: accountId,
    }),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const sharePostRequest = async (postId, accountId) => {
  return fetch(`${type.BACKEND_URL}/api/post/${postId}/share`, {
    method: "POST",
    headers: type.requestHeader,
    body: JSON.stringify({
      accountId: accountId,
    }),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
