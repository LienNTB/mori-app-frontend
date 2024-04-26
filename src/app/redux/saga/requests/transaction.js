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
      .catch((error) => {
        console.log("error:", error);
      });
  };