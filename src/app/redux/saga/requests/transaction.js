import * as type from "../../types";
export const createTransactionRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/transaction/add-transaction`, {
    method: "POST",
    headers: type.requestHeader,
    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {});
};

export const getUserTransactionsRequest = async (account, typeTrans) => {
  return fetch(
    `${type.BACKEND_URL}/api/transaction/get-usertrans?account=${account}&type=${typeTrans}`,
    {
      method: "GET",
      headers: type.getRequestHeader(),
      credentials: 'include',
    }
  )
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const getTransactionUserBuyBookRequest = async (book_id, user_id) => {
  return fetch(
    `${type.BACKEND_URL}/api/transaction/get-transaction/${book_id}/${user_id}`,
    {
      method: "GET",
      headers: type.getRequestHeader(),
      credentials: 'include',
    }
  )
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
