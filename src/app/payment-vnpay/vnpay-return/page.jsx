"use client";
import React from "react";
import { useEffect, useState } from "react";
import styles from "./vnpay-return.module.scss";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import * as request from "@/app/redux/saga/requests/membership";
import Link from "next/link";
import { createTransactionRequest } from "@/app/redux/saga/requests/transaction";

const VNpayreturn = () => {
  const router = useRouter();
  const [queryData, setQueryData] = useState({});
  const [membership, setMembership] = useState(null)
  const [payment, setPayment] = useState(null)
  const [currentAccount, setCurrentAccount] = useState(null)
  const [userVoucher, setUserVoucher] = useState(null)

  const handleRegisterMembership = async (membership) => {
    toast.promise(
      new Promise((resolve, reject) => {
        request.registerMembershipRequest(membership).then((resp) => {
          if (resp === 0) {
            resolve("Đăng kí gói cước thành công!");
            request.updateMembershipStatusRequest(currentAccount._id, true)
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
  const handleCreateTransaction = async (transaction) => {
    toast.promise(
      new Promise((resolve, reject) => {
        createTransactionRequest(transaction).then((resp) => {
          if (resp === 0) {
            resolve("Mua sách thành công");
          }
          if (resp === 1) {
            reject(new Error("Mua sách thất bại, vui lòng kiểm tra lại"));
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

    setMembership(JSON.parse(localStorage.getItem("membership")));
    setPayment(JSON.parse(localStorage.getItem("payment")));
    setCurrentAccount(JSON.parse(localStorage.getItem("user")));
    setUserVoucher(JSON.parse(localStorage.getItem("userVoucher")));
  }, []);

  useEffect(() => {
    if (queryData && queryData != {}) {
      if (queryData.vnp_ResponseCode === "00"
        && currentAccount
        && payment
        && userVoucher
      ) {
        console.log("co ton tai")
        try {
          const transaction = {
            account: currentAccount._id,
            product: payment.productId,
            productType: payment.type,
            status: 1,
            amount: payment.price,
            userVoucher: userVoucher._id
          };
          if (membership && payment.type == "Membership") {
            handleRegisterMembership(membership);
            handleCreateTransaction(transaction);
            localStorage.removeItem("payment");
            localStorage.removeItem("membership");
          } else if (payment && payment.type == "Book") {
            handleCreateTransaction(transaction);
            localStorage.removeItem("payment");
          }
        } catch {
          toast.error("Không tồn tại sản phẩm bạn cần thanh toán");
        }
      }
    }
  }, [queryData, payment, currentAccount, userVoucher, membership])
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
          <Link href="/homepage" className={styles.button} prefetch={false} >
            Về trang chủ
          </Link>
        </p>
      </div>
      <Footer />
    </>
  );
};

export default VNpayreturn;