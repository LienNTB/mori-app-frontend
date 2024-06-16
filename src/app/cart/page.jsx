"use client";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./cart.module.scss";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { cartOfCustomerRequest } from "../redux/saga/requests/cart";
import CartItem from "../../components/CartItem/CartItem";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

function Cart() {
  const router = useRouter();
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  const toggleSelected = (itemId) => {
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [itemId]: !prevSelectedItems[itemId],
    }));
  };

  const handleCheckout = () => {
    let orderItems = getSelectedItems();
    if (orderItems.length == 0) {
      toast.error("Vui lòng chọn sách bạn muốn đặt hàng");
    } else {
      localStorage.setItem("orderItems", JSON.stringify(orderItems));
      router.replace("/checkout", undefined, { shallow: true });
      // window.location.href = "/checkout";
    }
  };

  // Hàm kiểm tra xem một sản phẩm có được chọn hay không
  const isItemSelected = (itemId) => {
    return !!selectedItems[itemId];
  };

  // Hàm lấy danh sách các sản phẩm đã được chọn
  const getSelectedItems = () => {
    return cartItems.filter((item) => isItemSelected(item._id));
  };

  useEffect(() => {
    let currentAccount = JSON.parse(localStorage.getItem("user"));
    const id = currentAccount._id;
    cartOfCustomerRequest(id).then((res) => {
      setCartItems(res.cartItems);
    });
    localStorage.removeItem("orderItems");
  }, []);

  useEffect(() => {
    calculateTotalPrice(cartItems);
  }, [selectedItems, cartItems]);

  const calculateTotalPrice = (cartItems) => {
    let totalPrice = 0;
    if (cartItems) {
      cartItems.forEach((item) => {
        if (isItemSelected(item._id)) {
          totalPrice += item.book_id.price * item.quantity;
        }
      });
    }
    setTotalPrice(totalPrice);

  };

  // update quality khi cộng trừ quality
  const updateQuatity = async (cartItemId, newQuantity) => {
    try {
      cartItems.forEach((item) => {
        if (item._id == cartItemId) {
          item.quantity = newQuantity;
        }
      });
      calculateTotalPrice(cartItems);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
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
                  <CartItem
                    key={cartItem._id}
                    cartItem={cartItem}
                    selected={selectedItems[cartItem._id]}
                    toggleSelected={toggleSelected}
                    updateQuatity={updateQuatity}
                  />
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
              <div className={styles.checkoutBtn} onClick={handleCheckout}>
                Đặt hàng
              </div>
              <div className={styles.continueBtn}>
                <FontAwesomeIcon icon={faArrowLeft} weight={25} height={25} />
                <div onClick={() => window.location.replace("/", undefined, { shallow: true })}>
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
