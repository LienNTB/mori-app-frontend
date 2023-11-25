import * as type from "../../types";
export const getReviewsByIdRequest = async (id) => {
  return fetch(`http://localhost:8080/api/review/getReviews/${id}`, {
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
export const reviewBookRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/review/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
