export const getAccountsRequest = async (searchValue) => {
  return fetch(`http://localhost:8080/api/account/get-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      searchValue: searchValue,
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
};
