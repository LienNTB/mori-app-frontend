import * as Type from "../../types";
export const createTransactionRequest = async (request) => {
  return fetch(`${Type.BACKEND_URL}/api/transaction/add-transaction`, {
    method: "POST",
    headers: Type.requestHeader,
    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log("error:", error);
    });
};

export const getUserTransactionsRequest = async (account, type) => {
  return fetch(`${Type.BACKEND_URL}/api/transaction/get-usertrans?account=${account}&type=${type}`,
    {
      method: "GET",
      headers: type.requestHeader,
    }
  )
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
