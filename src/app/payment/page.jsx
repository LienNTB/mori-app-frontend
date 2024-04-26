"use client";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./payment.module.scss";
import React from "react";
import momo from "../../../public/logo-momo.png";
import vnpay from "../../../public/logo-vnpay.png";
import { faArrowLeft, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import * as types from "@/app/redux/types";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  orderPaymentRequest,
} from "@/app/redux/saga/requests/order";

function Payment() {
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [activePaymentMethod, setActivePaymentMethod] = React.useState("qr");
  const [isOpen, setIsOpen] = useState(false); // State for dropdown visibility
  const [membership, setMembership] = useState(0);
  const [payment, setPayment] = useState(0);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handlePaymentMethodClick = (method) => {
    setActivePaymentMethod(method);
  };

  const handleVNPAY = async () => {
    try {
      const requestPayment = {
        amount: payment.price,
        bankCode: "",
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

    // router.replace("/payment-vnpay");
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  useEffect(() => {
    const currentAccount = JSON.parse(localStorage.getItem("user"));
    setCurrentAccount(currentAccount);

    const membership = JSON.parse(localStorage.getItem("membership"));
    setMembership(membership);
    console.log("membership", membership);

    const payment = JSON.parse(localStorage.getItem("payment"));
    setPayment(payment);
    console.log("payment", payment);

    setPaymentMethod("cod");
  }, []);

  const banks = [
    // Replace with your actual bank data
    // { name: "VietcomBank", logo: "/svgs/thumb-loading-vertical.svg" },
    // ... add more banks
  ];

  const creditCards = [
    // Replace with your actual credit card data
    // { name: "Visa", logo: "/svgs/thumb-loading-vertical.svg" },
    // { name: "MasterCard", logo: "/svgs/thumb-loading-vertical.svg" },
    // ... add more credit cards
  ];

  const digitalWallet = [
    // { name: "Momo", logo: momo },
    // { name: "VnPAY", logo: vnpay },
  ];

  const renderBankOptions = () => {
    return banks.map((bank) => (
      <div
        key={bank.name}
        className={`${styles.bankItem} p-2 hover:bg-white-default rounded-xl border hover:border-waka-500 flex cursor-pointer bg-white-default border-white-overlay`}
        onClick={() => handlePaymentMethodClick("bank")}
      >
        <div className={styles.bankLogo}>
          <img
            src={bank.logo}
            alt={`Bank logo: ${bank.name}`}
            className="object-cover cursor-pointer h-auto w-full rounded-xl object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center">
            <p className="font-medium text-base text-white-50">{bank.name}</p>
          </div>
          <p className="text-[13px] text-white-300">Thẻ ngân hàng nội địa</p>
        </div>
      </div>
    ));
  };

  const renderCreditCardOptions = () => {
    return creditCards.map((card) => (
      <div
        key={card.name}
        className={`${styles.bankItem} p-2 hover:bg-white-default rounded-xl border hover:border-waka-500 flex cursor-pointer bg-white-default border-white-overlay`}
        onClick={() => handlePaymentMethodClick("card")}
      >
        <div className={styles.bankLogo}>
          <img
            src={card.logo}
            alt={`Card logo: ${card.name}`}
            className="object-cover cursor-pointer h-auto w-full rounded-xl object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center">
            <p className="font-medium text-base text-white-50">{card.name}</p>
          </div>
        </div>
      </div>
    ));
  };

  const renderDigitalWalletOptions = () => {
    return digitalWallet.map((digitalWallet) => (
      <div
        key={digitalWallet.name}
        className={`${styles.bankItem} p-2 hover:bg-white-default rounded-xl border hover:border-waka-500 flex cursor-pointer bg-white-default border-white-overlay`}
        onClick={() => handlePaymentMethodClick("card")}
      >
        <div className={styles.bankLogo}>
          <img
            src={digitalWallet.logo}
            alt={`Card logo: ${digitalWallet.name}`}
            className="object-cover cursor-pointer h-auto w-full rounded-xl object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center">
            <p className="font-medium text-base text-white-50">
              {digitalWallet.name}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <p className={styles.title}>Chọn hình thức thanh toán</p>
        <p className={styles.description}>An toàn - Nhanh chóng - Bảo mật</p>
      </div>
      <div className={styles.parentContainer}>
        <div className={styles.paymentMethod}>
          <div className={styles.paymentMethodHeader}>
            <p className="font-medium text-base pt-5 pb-6 text-50">
              Chọn phương thức thanh toán
            </p>
          </div>
          <div
            className={`${styles.paymentMethodOption} ${
              activePaymentMethod === "qr" ? styles.active : ""
            }`}
            onClick={() => handlePaymentMethodClick("qr")}
          >
            <div className={styles.qrIcon}>
              <img
                src="https://waka.vn/svgs/icon-pay-qr-active.svg"
                alt="icon-pay-qr-active"
                className="cursor-pointer"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center">
                <p className="font-medium text-base text-white-50">
                  Quét QR CODE
                </p>
              </div>
            </div>
            <div className={styles.checkedIcon}>
              {activePaymentMethod === "qr" && (
                <img
                  src="https://waka.vn/svgs/icon-checked-active.svg"
                  alt="icon-checked-active"
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>

          <div
            className={`${styles.paymentMethodOption} ${
              activePaymentMethod === "bank" ? styles.active : ""
            }`}
            onClick={() => handlePaymentMethodClick("bank")}
          >
            <div className={styles.qrIcon}>
              <img
                src="https://waka.vn/svgs/icon-bank.svg"
                alt="icon-pay-qr-active"
                className="cursor-pointer"
              />
            </div>
            <div className={styles.bankList}>{renderBankOptions()}</div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center">
                <p className="font-medium text-base text-white-50">
                  Thẻ ATM có Internet Banking
                </p>
              </div>
            </div>
            <div className={styles.checkedIcon}>
              {activePaymentMethod === "bank" && (
                <img
                  src="https://waka.vn/svgs/icon-checked-active.svg"
                  alt="icon-checked-active"
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>

          <div
            className={`${styles.paymentMethodOption} ${
              activePaymentMethod === "card" ? styles.active : ""
            }`}
            onClick={() => handlePaymentMethodClick("card")}
          >
            <div className={styles.qrIcon}>
              <img
                src="https://waka.vn/svgs/icon-money-card.svg"
                alt="icon-pay-qr-active"
                className="cursor-pointer"
              />
            </div>
            <div className={styles.bankList}>{renderCreditCardOptions()}</div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center">
                <p className="font-medium text-base text-white-50">
                  Thẻ quốc tế Visa/Master/JBC
                </p>
              </div>
            </div>
            <div className={styles.checkedIcon}>
              {activePaymentMethod === "card" && (
                <img
                  src="https://waka.vn/svgs/icon-checked-active.svg"
                  alt="icon-checked-active"
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>

          <div
            className={`${styles.paymentMethodOption} ${
              activePaymentMethod === "digital-wallet" ? styles.active : ""
            }`}
            onClick={() => handlePaymentMethodClick("digital-wallet")}
          >
            <div className={styles.qrIcon}>
              <img
                src="https://waka.vn/svgs/icon-money-wallet.svg"
                alt="icon-pay-qr-active"
                className="cursor-pointer"
              />
            </div>
            <div className={styles.bankList}>
              {renderDigitalWalletOptions()}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center">
                <p className="font-medium text-base text-white-50">
                  Ví điện tử
                </p>
              </div>
            </div>
            <div className={styles.checkedIcon}>
              {activePaymentMethod === "digital-wallet" && (
                <img
                  src="https://waka.vn/svgs/icon-checked-active.svg"
                  alt="icon-checked-active"
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.containerA}>
          <p className={styles.titleA}>Thông tin thanh toán</p>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td className={styles.label}>Sản phẩm</td>
                <td className={styles.product}>
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownButton}>
                      <p className={styles.dropdownText}>{payment.description}</p>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className={styles.label}>Tạm tính</td>
                <td className={styles.price}>{payment.price}</td>
              </tr>
              <tr>
                <td className={styles.label}>Hình thức thanh toán</td>
                <td className={styles.paymentMethodA}>
                  {paymentMethod === "qr" && "QR Code"}
                  {paymentMethod === "bank" && "Thẻ ATM"}
                  {paymentMethod === "card" && "Thẻ tín dụng/ghi nợ"}
                  {paymentMethod === "digital-wallet" && "Ví điện tử"}
                </td>
              </tr>
              <tr className={styles.hidden}>
                <td className={styles.label}>Giảm giá</td>
                <td className={styles.discount}>-10%</td>
              </tr>
              <tr>
                <td className={`${styles.label} ${styles.borderTop}`}>TỔNG</td>
                <td className={`${styles.total} ${styles.borderTop}`}>
                  {payment.price}
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.button}
              onClick={handleVNPAY}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Payment;
