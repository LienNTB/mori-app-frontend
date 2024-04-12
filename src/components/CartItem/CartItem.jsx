import styles from "./CartItem.module.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import * as types from "@/app/redux/types";

import {
  updateCartItemQuantityRequest,
  deleteBookFromCartRequest,
} from "@/app/redux/saga/requests/cart";

function CartItem({ cartItem, selected, toggleSelected, updateQuatity }) {
  const { book_id, quantity } = cartItem;
  const [productQuantity, setProductQuantity] = useState(quantity);

  const updateCartItemQuantity = async (cartItemId, quantity) => {
    try {
      const request = {
        cartItemId: cartItemId,
        quantity: quantity,
      };
      updateCartItemQuantityRequest(request);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleDeleteFromCart = (cartItemId) => {
    const confirmed = window.confirm(
      "Bạn có muốn xóa sản phẩm khỏi giỏ hàng không?"
    );
    if (confirmed) {
      deleteBookFromCartRequest(cartItemId);
    }
    refreshPage();
  };

  const handleDecreaseAmount = async () => {
    if (productQuantity > 1) {
      setProductQuantity(productQuantity - 1);
      // callback về page Cart về thay đổi quatity
      updateQuatity(cartItem._id, productQuantity - 1);
      await updateCartItemQuantity(cartItem._id, productQuantity - 1);
    } else if (productQuantity == 1) {
      const confirmed = window.confirm(
        "Bạn có muốn xóa sản phẩm khỏi giỏ hàng không?"
      );
      if (confirmed) {
        deleteBookFromCartRequest(cartItem._id);
        refreshPage();
      }
    }
  };

  const handleIncreaseAmount = async () => {
    setProductQuantity(productQuantity + 1);
    // callback về page Cart về thay đổi quatity
    updateQuatity(cartItem._id, productQuantity + 1);
    await updateCartItemQuantity(cartItem._id, productQuantity + 1);
  };

  // refresh page khi xóa một sản phẩm
  function refreshPage() {
    window.location.reload(false);
    toast("Xoá thành công!", {
      hideProgressBar: true,
      autoClose: 2000,
      type: "success",
      position: "top-right",
    });
  }

  return (
    <div className={styles.cartItemContainer}>
      <div className={styles.cartItem}>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => toggleSelected(cartItem._id)}
        />
        <a href={`/book/${book_id._id}`} className={styles.img}>
          <img
            src={`${types.BACKEND_URL}/api/bookimg/${book_id.image}`}
            alt="img book"
          />
        </a>
        <div className={styles.productCartInfo}>
          <div className={styles.title}>
            <a href={`/book/${book_id._id}`}>{book_id.name}</a>
          </div>
          <div className={styles.price}>{book_id.price}</div>
          <div className={styles.quantityWrapper}>
            <div
              className={styles.btnDecrease}
              onClick={() => handleDecreaseAmount()}
            >
              -
            </div>
            <input type="text" value={productQuantity} />
            <div
              className={styles.btnIncrease}
              onClick={() => {
                handleIncreaseAmount();
              }}
            >
              +
            </div>
          </div>
        </div>
        <div
          className={styles.deleteBtn}
          onClick={() => handleDeleteFromCart(cartItem._id)}
        >
          Xoá
        </div>
      </div>
      <div className={styles.ruler}></div>
    </div>
  );
}

export default CartItem;
