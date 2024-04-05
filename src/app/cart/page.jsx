"use client";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./cart.module.scss";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import {
  addBooktoCartRequest,
  cartOfCustomerRequest,
} from "../redux/saga/requests/cart";

import CartItem from "../../components/CartItem/CartItem";
import { Toaster } from "react-hot-toast";

function Cart() {
  const breadcumbList = ["Trang chủ", "Giỏ hàng"];
  // const [domLoaded, setDomLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  let currentAccount = JSON.parse(localStorage.getItem("user"));
  const id = currentAccount._id;
  const [totalPrice, setTotalPrice] = useState(0);

  const [cartItems, setCartItems] = useState([]);

  // Lấy thông tin giỏ hàng từ server khi component được render
  useEffect(() => {
    cartOfCustomerRequest(id).then((res) => {
      setCartItems(res.cartItems);
      calculateTotalPrice(res.cartItems);
    });
  }, []);

  // Hàm tính tổng tiền từ thông tin giỏ hàng
  const calculateTotalPrice = (cartItems) => {
    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalPrice += item.book_id.price * item.quantity;
    });
    setTotalPrice(totalPrice);
  };

  return (
    <>
      <div className={styles.cartContainerWrapper}>
        <Toaster />
        <Header />
        <div className={styles.wrapper}>
          <div className={styles.cartContainer}>
            <div className={styles.header}>Giỏ hàng</div>
            <div className={styles.ruler}></div>
            <div className={styles.cartList}>
              {cartItems.length > 0 ? (
                cartItems.map((cartItem) => (
                  <CartItem key={cartItem._id} cartItem={cartItem} />
                ))
              ) : (
                <div className={styles.emptyCartMessage}>
                  Không có sản phẩm trong giỏ hàng
                </div>
              )}
            </div>
            <div className={styles.titleCart}>
              <h2>Tổng tiền: </h2>
              <div className={styles.price}>
                {totalPrice.toLocaleString("ko-KR", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>
            </div>
            <div className={styles.checkoutActions}>
              <a href="/checkout">
                <div className={styles.checkoutBtn}>
                  Để lại thông tin mua hàng
                </div>
              </a>
              <div className={styles.continueBtn}>
                <FontAwesomeIcon icon={faArrowLeft} />
                <div onClick={() => window.location.replace("/")}>
                  Tiếp tục mua hàng
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Cart;
