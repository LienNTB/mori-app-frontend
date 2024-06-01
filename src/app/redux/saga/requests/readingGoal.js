import * as type from "../../../redux/types";

export const createReadingGoalRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/readingGoal`, {
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

export const getReadingGoalsByUserId = async (id) => {
  return fetch(`${type.BACKEND_URL}/api/readingGoal/${id}`, {
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

export const resetReadingProgressRequest = async (goalId) => {
  return fetch(`${type.BACKEND_URL}/api/readingGoal/${goalId}/reset`, {
    method: "POST",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
