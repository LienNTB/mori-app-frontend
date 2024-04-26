"use client";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./payment.module.scss";
import { faArrowLeft, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import {
  orderPaymentRequest,
} from "../redux/saga/requests/order";
import { useRouter } from "next/navigation";

function Payment() {
  const router = useRouter();
  const [price, setPrice] = useState(0);
  const [currentAccount, setCurrentAccount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(0);

  const handlePayment = async () => {
    try {
      const requestPayment = {
        amount: price,
        bankCode: bankCode,
        language: "vn",
      };
      const paymentResp = await orderPaymentRequest(requestPayment);

      // Nếu orderPaymentRequest thành công
      if (paymentResp && paymentResp.paymentUrl) {
        // Chuyển hướng trình duyệt đến URL thanh toán từ dữ liệu phản hồi
        router.push(paymentResp.paymentUrl);
      } else {
        throw new Error("Đã có lỗi xảy ra khi thực hiện thanh toán");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  };

  useEffect(() => {
    const currentAccount = JSON.parse(localStorage.getItem("user"));
    setCurrentAccount(currentAccount);

    const membership = JSON.parse(localStorage.getItem("membership"));
    const payment = JSON.parse(localStorage.getItem("payment"));
    setPrice(payment.price);
    setPaymentMethod("vnpay");
  }, []);

  const [bankCode, setBankCode] = useState("");
  const [language, setLanguage] = useState("vn");

  const handleBankCodeChange = (e) => {
    setBankCode(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <>
      <div className={styles.container}>
        <h3>Payment VNPAY Demo</h3>
        <div className={styles.tableResponsive}>
          <div className={styles.formGroup}>
            <label className={styles.title} htmlFor="amount">
              Số tiền
            </label>
            <input
              type="text"
              className={styles.formControl}
              value={price}
              disabled
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.title}>Chọn Phương thức thanh toán:</label>
            <div className={styles.controls}>
              <label className={styles.radioInline}>
                <input
                  type="radio"
                  name="bankCode"
                  id="defaultPaymentMethod"
                  value=""
                  checked={bankCode === ""}
                  onChange={handleBankCodeChange}
                />
                Cổng thanh toán VNPAYQR
              </label>
              <label className={styles.radioInline}>
                <input
                  type="radio"
                  name="bankCode"
                  id="vnpayqrPaymentMethod"
                  value="VNPAYQR"
                  checked={bankCode === "VNPAYQR"}
                  onChange={handleBankCodeChange}
                />
                Thanh toán qua ứng dụng hỗ trợ VNPAYQR
              </label>
              <label className={styles.radioInline}>
                <input
                  type="radio"
                  name="bankCode"
                  id="vnbankPaymentMethod"
                  value="VNBANK"
                  checked={bankCode === "VNBANK"}
                  onChange={handleBankCodeChange}
                />
                Thanh toán qua ATM-Tài khoản ngân hàng nội địa
              </label>
              <label className={styles.radioInline}>
                <input
                  type="radio"
                  name="bankCode"
                  id="intcardPaymentMethod"
                  value="INTCARD"
                  checked={bankCode === "INTCARD"}
                  onChange={handleBankCodeChange}
                />
                Thanh toán qua thẻ quốc tế
              </label>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.title}>Ngôn ngữ</label>
            <div className={styles.controls}>
              <label className={styles.radioInline}>
                <input
                  type="radio"
                  name="language"
                  id="vnLanguage"
                  value="vn"
                  checked={language === "vn"}
                  onChange={handleLanguageChange}
                />
                Tiếng việt
              </label>
              <label className={styles.radioInline}>
                <input
                  type="radio"
                  name="language"
                  id="enLanguage"
                  value="en"
                  checked={language === "en"}
                  onChange={handleLanguageChange}
                />
                Tiếng anh
              </label>
            </div>
          </div>
          <button
            type="submit"
            className={styles.btnPopup}
            onClick={handlePayment}
          >
            Thanh toán
          </button>
        </div>
        <p>&nbsp;</p>
      </div>
    </>
  );
}

export default Payment;
