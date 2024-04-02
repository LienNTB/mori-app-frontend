"use client"
import Header from '../../components/Header/Header'
import Footer from "../../components/Footer/Footer";
import styles from "./cart.module.scss";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

import CartItem from "../../components/CartItem/CartItem";
import { Toaster } from 'react-hot-toast';

function Cart() {

  const breadcumbList = ["Trang chủ", "Giỏ hàng"];
  // const [domLoaded, setDomLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const [cart, setCart] = useState([]);



  const handleTotalPrice = () => {
    var t = 0;
    setCart(JSON.parse(localStorage.getItem("cart")));
    if (cart) {
      const newCart = cart.map((cartItem) => {
        t = t + cartItem.product.initialPrice * cartItem.quantity;
      });
      setCart(newCart)
      setTotalPrice(t)
    }
  };
  useEffect(() => {
    handleTotalPrice();
  }, []);

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
              {/* {
                cart ?
                  cart.map((cartItem) => (
                    <CartItem
                      cartItem={cartItem}
                      handleTotalPrice={() => handleTotalPrice()}
                    />
                  
                  ))
                  :
                  <>no books in cart.</>
              } */}
              <CartItem />
              <CartItem />
              <CartItem />
              <CartItem />
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
                <div className={styles.checkoutBtn}>Để lại thông tin mua hàng</div>
              </a>
              <div className={styles.continueBtn}>
                <FontAwesomeIcon icon={faArrowLeft} />

                <div onClick={() => window.location.replace("/")}>Tiếp tục mua hàng</div>
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
