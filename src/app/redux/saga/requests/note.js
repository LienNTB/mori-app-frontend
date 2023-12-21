import * as type from "../../types";

export const addNoteForBookRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/note/add-note`, {
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
export const getNotesForBookByUserRequest = async (book_id, user_id) => {
  return fetch(`${type.BACKEND_URL}/api/note/get-note/${book_id}/${user_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
};
