"use client";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./payment.module.scss";
import { faArrowLeft, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import {
  orderRequest,
  orderPaymentRequest,
} from "../redux/saga/requests/order";
import { deleteBookFromCartRequest } from "@/app/redux/saga/requests/cart";
import * as types from "@/app/redux/types";
import { Button, Spinner, getKeyValue } from "@nextui-org/react";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

function Payment() {
  const router = useRouter();
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");

  const deleteCartItems = () => {
    cartItems.forEach((cartItem) => {
      deleteBookFromCartRequest(cartItem._id);
    });
    setCartItems([]);
    setTotalPrice(0);
    localStorage.removeItem("orderItems");
  };

  const handlePayment = async () => {
    try {
      // Tạo OrderItems từ CartItems
      const orderItems = cartItems.map((cartItem) => ({
        book_id: cartItem.book_id._id,
        quantity: cartItem.quantity,
        price: cartItem.book_id.price,
      }));

      const requestPayment = {
        amount: totalPrice,
        bankCode: bankCode,
        language: "vn",
      };

      const request = {
        account_id: currentAccount._id,
        orderItems: orderItems,
        // address_id: ,
        // note: ,
        // deliveryType: ,
        paymentMethod: paymentMethod,
      };

      const paymentResp = await orderPaymentRequest(requestPayment);

      // Nếu orderPaymentRequest thành công
      if (paymentResp && paymentResp.paymentUrl) {
        // Chuyển hướng trình duyệt đến URL thanh toán từ dữ liệu phản hồi
        router.push(paymentResp.paymentUrl);
        // window.location.href = paymentResp.paymentUrl;
        // Thực hiện orderRequest
        const orderResp = await orderRequest(request);

        console.log("orderResp", orderResp.message);
        // Kiểm tra kết quả từ orderResp
        if (orderResp.message) {
          // Xóa cart items khi đặt hàng thành công
          deleteCartItems();
          return "Đặt hàng thành công";
        } else {
          throw new Error("Đã có lỗi xảy ra khi thực hiện đặt hàng");
        }
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
    const orderItems = JSON.parse(localStorage.getItem("orderItems"));
    if (orderItems) {
      setCartItems(orderItems);
      calculateTotalPrice(orderItems);
    }
    setPaymentMethod("vnpay");
  }, []);

  // Hàm tính tổng tiền từ thông tin giỏ hàng
  const calculateTotalPrice = (cartItems) => {
    let totalPrice = 0;
    if (cartItems) {
      cartItems.forEach((item) => {
        totalPrice += item.book_id.price * item.quantity;
      });
      setTotalPrice(totalPrice);
    }
  };
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
              value={totalPrice}
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
