import { useSelector } from "react-redux";

export const getAllBooksRequest = async () => {
  return fetch(`http://localhost:8080/api/book/get-book`, {
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

export const getBookByIdRequest = async (id) => {
  return fetch(`http://localhost:8080/api/book/get-book/${id}`, {
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

export const increaseTotalReadRequest = async (id) => {
  return fetch(`http://localhost:8080/api/book/total-read/${id}`, {
    method: "POST",
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

export const increaseTotalSavedRequest = async (id) => {
  return fetch(`http://localhost:8080/api/book/total-saved/${id}`, {
    method: "POST",
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
