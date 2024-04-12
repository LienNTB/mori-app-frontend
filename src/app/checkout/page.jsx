"use client";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./checkout.module.scss";
import { faArrowLeft, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { orderRequest, orderPaymentRequest } from "../redux/saga/requests/order";
import { deleteBookFromCartRequest } from "@/app/redux/saga/requests/cart";
import * as types from "@/app/redux/types";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  getKeyValue,
} from "@nextui-org/react";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

function Checkout() {
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

  const handleCheckout = async () => {
    router.replace("/payment-vnpay")
    // try {
    //   // Tạo OrderItems từ CartItems
    //   const orderItems = cartItems.map((cartItem) => ({
    //     book_id: cartItem.book_id._id,
    //     quantity: cartItem.quantity,
    //     price: cartItem.book_id.price,
    //   }));

    //   const request = {
    //     account_id: currentAccount._id,
    //     orderItems: orderItems,
    //     // address_id: ,
    //     // note: ,
    //     // deliveryType: ,
    //     paymentMethod: paymentMethod,
    //   };

    //   toast.promise(
    //     new Promise((resolve, reject) => {
    //       orderRequest(request).then((resp) => {
    //         if (resp.message) {
    //           resolve("Đặt hàng thành công");

    //           // Xóa các cartItems khi đã đặt hàng thành công
    //           deleteCartItems();
    //         } else {
    //           reject(new Error("Đã có lỗi xảy ra, đặt hàng thất bại"));
    //         }
    //       });
    //     }),
    //     {
    //       loading: "Processing...",
    //       success: (message) => message,
    //       error: (error) => error.message,
    //     }
    //   );
    // } catch (error) {
    //   console.error("Error placing order:", error);
    //   throw error;
    // }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  useEffect(() => {
    const currentAccount = JSON.parse(localStorage.getItem("user"));
    setCurrentAccount(currentAccount);
    const orderItems = JSON.parse(localStorage.getItem("orderItems"));
    if (orderItems) {
      setCartItems(orderItems);
      calculateTotalPrice(orderItems);
    }
    setPaymentMethod("cod");
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

  return (
    <>
      <div className={styles.cartContainerWrapper}>
        <Toaster />
        <Header />
        <div className={styles.wrapper}>
          <div className={styles.cartContainer}>
            <div className={styles.header}>Thanh toán</div>
            <div className={styles.ruler}></div>
          </div>
          <section className={styles.section}>
            <div className={styles.hYgtuo}>
              <div className={styles.SvK9MH}>
                <div className={styles.IZawzb}>
                  <div className={styles.qclVa9}>
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      width={30}
                      height={30}
                    ></FontAwesomeIcon>
                  </div>
                  <h2>Địa chỉ nhận hàng</h2>
                </div>
              </div>
              <div className={styles.i1xLmh}>
                <div>
                  <div className={styles.y0jyrJ}>
                    <div className={styles.PzGLCh}>
                      Nguyễn Liên (+84) 971478922
                    </div>
                    <div className={styles.a9c4OR}>
                      Đường 147, Phường Phước Long B, Thành Phố Thủ Đức, TP. Hồ
                      Chí Minh
                    </div>
                    <div className={styles.dIzOca}>Mặc định</div>
                  </div>
                </div>
                <button className={styles.VNkBIJ}>Thay đổi</button>
              </div>
            </div>
          </section>
          <section className={styles.section}>
            <div className={styles.itemTable}>
              <Table>
                <TableHeader>
                  {/* <TableColumn key="rank">Số thứ tự</TableColumn> */}
                  <TableColumn>Sách</TableColumn>
                  <TableColumn>Đơn giá</TableColumn>
                  <TableColumn>Số lượng</TableColumn>
                  <TableColumn>Thành tiền</TableColumn>
                </TableHeader>
                <TableBody items={cartItems} loadingContent={<Spinner />}>
                  {(item, index) => (
                    <TableRow key={item?._id}>
                      <TableCell className={styles.bookCell}>
                        <img
                          src={`${types.BACKEND_URL}/api/bookimg/${item?.book_id?.image}`}
                          alt={item?.book_id?.name || "Hình ảnh sách"}
                        />
                        <div>
                          <div className={styles.name}>
                            {item?.book_id?.name}
                          </div>
                          <div className={styles.price}>
                            {item?.book_id?.price}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item?.book_id?.price}</TableCell>
                      <TableCell>{item?.quantity}</TableCell>
                      <TableCell className={styles.bookCell}>
                        <div className={styles.price}>
                          {item?.book_id?.price * item?.quantity}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className={styles.titleCart}>
              Ghi chú:
              <textarea
                // value={note}
                // onChange={handleNoteChange}
                className={styles.inputField}
                placeholder="Lưu ý cho Mori về đơn hàng"
              />
            </div>
          </section>
          <section className={styles.section}>
            <h2 className={styles.titleCart}>Đơn vị vận chuyển </h2>
          </section>
          <section className={styles.section}>
            <h2 className={styles.titleCart}>Phương thức thanh toán</h2>
            <select
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              className={styles.inputField}
              required
            >
              <option value="cod">Thanh toán khi nhận hàng</option>
              <option value="creditcard">Thẻ tín dụng</option>
              <option value="momo">Momo</option>
              <option value="vnpay">VnPay</option>
            </select>
          </section>
          <section className={styles.section}>
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
            </div>
          </section>
        </div>
      </div>
      <Footer />
      {/* </div> */}
    </>
  );
}

export default Checkout;
