"use client";
import React from "react";
import { useEffect, useState } from "react";
import styles from "./vnpay-return.module.scss";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import * as request from "@/app/redux/saga/requests/membership";

const VNpayreturn = () => {
  const router = useRouter();
  const [queryData, setQueryData] = useState({});
  const [membership, setMembership] = useState(0);

  const handleRegisterMembership = async (membership) => {
    toast.promise(
      new Promise((resolve, reject) => {
        request.registerMembershipRequest(membership).then((resp) => {
          if (resp === 0) {
            resolve("Đăng kí gói cước thành công!");
          }
          if (resp === 1) {
            reject(
              new Error(
                "Đăng kí gói cước thất bại, vui lòng sử dụng hết gói cước đã đăng kí!"
              )
            );
          }
        });
      }),
      {
        loading: "Processing...",
        success: (message) => message,
        error: (error) => error.message,
      }
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryParams = {};
    for (const [key, value] of params.entries()) {
      queryParams[key] = value;
    }
    setQueryData(queryParams);
  
    const membership = JSON.parse(localStorage.getItem("membership"));
    setMembership(membership);
  
    if (queryParams.vnp_ResponseCode === "00") {
      handleRegisterMembership(membership.membership);
    }
  }, []);

  const {
    vnp_Amount,
    vnp_BankCode,
    vnp_CardType,
    vnp_OrderInfo,
    vnp_PayDate,
    vnp_ResponseCode,
    vnp_TmnCode,
    vnp_TransactionNo,
    vnp_TransactionStatus,
    vnp_TxnRef,
  } = queryData;

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.message}>
          {vnp_ResponseCode === "00" ? (
            <p>
              Giao dịch được thực hiện thành công. Cảm ơn quý khách đã sử dụng
              dịch vụ
            </p>
          ) : (
            <div>Giao dịch không thành công</div>
          )}
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Amount</td>
                <td>{vnp_Amount}</td>
                <td>Số tiền được thanh toán</td>
              </tr>
              <tr>
                <td>Bank Code</td>
                <td>{vnp_BankCode}</td>
                <td>Mã ngân hàng</td>
              </tr>
              <tr>
                <td>Card Type</td>
                <td>{vnp_CardType}</td>
                <td>Loại thẻ</td>
              </tr>
              <tr>
                <td>Order Info</td>
                <td>{vnp_OrderInfo}</td>
                <td>Thông tin đơn hàng</td>
              </tr>
              <tr>
                <td>Pay Date</td>
                <td>{vnp_PayDate}</td>
                <td>Ngày thanh toán</td>
              </tr>
              <tr>
                <td>Response Code</td>
                <td>{vnp_ResponseCode}</td>
                <td>Mã phản hồi</td>
              </tr>
              <tr>
                <td>Terminal Code</td>
                <td>{vnp_TmnCode}</td>
                <td>Mã terminal</td>
              </tr>
              <tr>
                <td>Transaction Number</td>
                <td>{vnp_TransactionNo}</td>
                <td>Mã giao dịch</td>
              </tr>
              <tr>
                <td>Transaction Status</td>
                <td>{vnp_TransactionStatus}</td>
                <td>Trạng thái giao dịch</td>
              </tr>
              <tr>
                <td>Transaction Reference</td>
                <td>{vnp_TxnRef}</td>
                <td>Tham chiếu giao dịch</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={styles.linkContainer}>
          <a href="/" className={styles.button}>
            Về trang chủ
          </a>
        </p>
      </div>
      <Footer />
    </>
  );
};

export default VNpayreturn;
