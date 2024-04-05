import styles from "./CartItem.module.scss";
import { useState } from "react";
import { toast } from "react-toastify";

import { updateCartItemQuantityRequest, deleteBookFromCartRequest } from "@/app/redux/saga/requests/cart";

function CartItem({ cartItem, handleTotalPrice }) {
  // const { user } = useAuthContext();
  // const [productPrice, setProductPrice] = useState(
  //   props.cartItem.product.initialPrice * props.cartItem.quantity
  // );
  // const [quantity, setQuantity] = useState(props.cartItem.quantity);
  // const [initialPrice, setInitialPrice] = useState(
  //   props.cartItem.product.initialPrice
  // );

  // var cart = [];
  // if (typeof window !== "undefined") {
  //   cart = JSON.parse(localStorage.getItem("cart"));
  // }
  function refreshPage() {
    window.location.reload(false);
    toast("Xoá thành công!", {
      hideProgressBar: true,
      autoClose: 2000,
      type: "success",
      position: "top-right",
    });
  }

  // const updateCart = (actionType) => {
  //   // update new cart item with new quantity
  //   let updatedCartItem = cart.filter((cartItem) => {
  //     return cartItem.product._id === props.cartItem.product._id;
  //   });
  //   // delete from cart
  //   cart = cart.filter((cartItem) => {
  //     return cartItem.product._id !== props.cartItem.product._id;
  //   });
  //   if (actionType === "increase") {
  //     updatedCartItem[0].quantity = quantity + 1;
  //   } else {
  //     updatedCartItem[0].quantity = quantity - 1;
  //   }
  //   cart.push(updatedCartItem[0]);
  //   if (user && !user.isAnonymous) {
  //     updateDB(cart, "currentOrder");
  //   }
  //   localStorage.setItem("cart", JSON.stringify(cart));
  //   props.handleTotalPrice();
  // };

  // const handlePriceChange = (e) => {
  //   setQuantity(e.target.value);
  //   let updatedCartItem = cart.filter((cartItem) => {
  //     return cartItem.product._id === props.cartItem.product._id;
  //   });
  //   // delete from cart
  //   cart = cart.filter((cartItem) => {
  //     return cartItem.product._id !== props.cartItem.product._id;
  //   });
  //   updatedCartItem[0].quantity = e.target.value;
  //   setProductPrice(props.cartItem.product.initialPrice * e.target.value);

  //   cart.push(updatedCartItem[0]);
  //   if (user && !user.isAnonymous) {
  //     updateDB(cart, "currentOrder");
  //   }
  //   localStorage.setItem("cart", JSON.stringify(cart));
  //   props.handleTotalPrice();
  // };

  // const handleIncreaseAmount = () => {
  //   setQuantity(quantity + 1);
  //   setProductPrice(initialPrice * (quantity + 1));
  //   updateCart("increase");
  // };
  // const handleDecreaseAmount = () => {
  //   if (quantity != 1) {
  //     setQuantity(quantity - 1);
  //     setProductPrice(initialPrice * (quantity - 1));
  //     updateCart("decrease");
  //   }
  // };

  const handleDeleteFromCart = (cartItemId) => {
    deleteBookFromCartRequest(cartItemId);
    refreshPage();
  };
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
      throw error; // Ném lỗi để xử lý ở phía frontend nếu cần
    }
  };

  const handleDecreaseAmount = () => {
    if (productQuantity > 1) {
      setProductQuantity(productQuantity - 1);
    }
    updateCartItemQuantity(cartItem._id, productQuantity - 1);
  };

  const handleIncreaseAmount = () => {
    setProductQuantity(productQuantity + 1);
    console.log(productQuantity);
    updateCartItemQuantity(cartItem._id, productQuantity + 1);
  };
  return (
    <div className={styles.cartItemContainer}>
      <div className={styles.cartItem}>
        <div
          className={styles.deleteBtn}
          onClick={() => handleDeleteFromCart(cartItem._id)}
        >
          Xoá
        </div>
        <a href={`/book/${book_id._id}`} className={styles.img}>
          <img
            // src="https://tiemsach.org/wp-content/uploads/2023/09/csk0w7ik.png"
            src={book_id.image}
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
            <input
              type="text"
              value={productQuantity}
              onChange={(e) => handlePriceChange(e)}
            />
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
      </div>
      <div className={styles.ruler}></div>
    </div>
  );
}

export default CartItem;
