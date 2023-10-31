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
export const createAccountRequest = async (account) => {
  return fetch(`http://localhost:8080/api/account/add-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  })
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
};

export const getCurrentAccountRequest = async (account) => {
  return fetch(`http://localhost:8080/api/account/find-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  })
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
};
