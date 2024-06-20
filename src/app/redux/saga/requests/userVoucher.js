import * as type from "../../types";

export const getAllUserVouchersByUserIdRequest = async (userId) => {
  return fetch(`${type.BACKEND_URL}/api/userVoucher/${userId}`, {
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
