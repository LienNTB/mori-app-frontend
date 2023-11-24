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

export const increaseTotalSavedRequest = async (payload) => {
  return fetch(`http://localhost:8080/api/book/total-saved/${payload.bookId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: payload.accountId,
    }),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      console.log("error:", error);
    });
};

export const findBookByCategoryRequest = async (payload) => {
  return fetch(`http://localhost:8080/api/book/get-book/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      searchValue: payload,
    }),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      console.log("error:", error);
    });
};

export const getReadHistoryRequest = async (id) => {
  return fetch(`http://localhost:8080/api/readHistory/get-readHistory/${id}`, {
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

export const addNewReadHistory = async (request) => {
  return fetch(`http://localhost:8080/api/readHistory/add-readHistory`, {
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
      console.log("error:", error);
    });
};
