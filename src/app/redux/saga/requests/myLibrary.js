import * as type from "../../types";

export const getBooksFromMyLibraryRequest = async (userId) => {
  return fetch(`${type.BACKEND_URL}/api/myLibrary/get-books/${userId}`, {
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
export const addBookToLibraryRequest = async (bookRequest) => {
  return fetch(`${type.BACKEND_URL}/api/myLibrary/add-book/`, {
    method: "POST",
    headers: type.requestHeader,
    body: JSON.stringify(bookRequest),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const deleteBookFromLibraryRequest = async (bookRequest) => {
  return fetch(`${type.BACKEND_URL}/api/myLibrary/book/`, {
    method: "DELETE",
    headers: type.requestHeader,
    body: JSON.stringify(bookRequest),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
