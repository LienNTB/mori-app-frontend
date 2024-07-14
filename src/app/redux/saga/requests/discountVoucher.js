import * as type from "../../types";

export const getAllDiscountVouchersRequest = async () => {
  return fetch(`${type.BACKEND_URL}/api/discountVoucher`, {
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
