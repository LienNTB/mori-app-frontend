import * as type from "../../types";
export const getReviewsByIdRequest = async (id) => {
  return fetch(`${type.BACKEND_URL}/api/review/getReviews/${id}`, {
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
export const reviewBookRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/review/comment`, {
    method: "POST",
    headers: type.requestHeader,

    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const updateReviewRequest = async (id, content) => {
  return fetch(`${type.BACKEND_URL}/api/review/${id}`, {
    method: "PUT",
    headers: type.requestHeader,

    body: JSON.stringify({
      content: content,
    }),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
export const deleteReviewRequest = async (id) => {
  return fetch(`${type.BACKEND_URL}/api/review/${id}`, {
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
