export const getBookCategoryRequest = async () => {
  return fetch(`http://localhost:8080/api/bookCategory/bookCategories`, {
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
