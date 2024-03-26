import styles from "./CartItem.scss";
import { useState } from "react";
import { toast } from "react-toastify";


function CartItem(props) {
  const { user } = useAuthContext();
  const [productPrice, setProductPrice] = useState(
    props.cartItem.product.initialPrice * props.cartItem.quantity
  );
  const [quantity, setQuantity] = useState(props.cartItem.quantity);
  const [initialPrice, setInitialPrice] = useState(
    props.cartItem.product.initialPrice
  );

  var cart = [];
  if (typeof window !== "undefined") {
    cart = JSON.parse(localStorage.getItem("cart"));
  }
  function refreshPage() {
    window.location.reload(false);
    toast("Xoá thành công!", {
      hideProgressBar: true,
      autoClose: 2000,
      type: "success",
      position: "top-right",
    });
  }

  const updateCart = (actionType) => {
    // update new cart item with new quantity
    let updatedCartItem = cart.filter((cartItem) => {
      return cartItem.product._id === props.cartItem.product._id;
    });
    // delete from cart
    cart = cart.filter((cartItem) => {
      return cartItem.product._id !== props.cartItem.product._id;
    });
    if (actionType === "increase") {
      updatedCartItem[0].quantity = quantity + 1;
    } else {
      updatedCartItem[0].quantity = quantity - 1;
    }
    cart.push(updatedCartItem[0]);
    if (user && !user.isAnonymous) {
      updateDB(cart, "currentOrder");
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    props.handleTotalPrice();
  };

  const handlePriceChange = (e) => {
    setQuantity(e.target.value);
    let updatedCartItem = cart.filter((cartItem) => {
      return cartItem.product._id === props.cartItem.product._id;
    });
    // delete from cart
    cart = cart.filter((cartItem) => {
      return cartItem.product._id !== props.cartItem.product._id;
    });
    updatedCartItem[0].quantity = e.target.value;
    setProductPrice(props.cartItem.product.initialPrice * e.target.value);

    cart.push(updatedCartItem[0]);
    if (user && !user.isAnonymous) {
      updateDB(cart, "currentOrder");
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    props.handleTotalPrice();
  };

  const handleIncreaseAmount = () => {
    setQuantity(quantity + 1);
    setProductPrice(initialPrice * (quantity + 1));
    updateCart("increase");
  };
  const handleDecreaseAmount = () => {
    if (quantity != 1) {
      setQuantity(quantity - 1);
      setProductPrice(initialPrice * (quantity - 1));
      updateCart("decrease");
    }
  };

  const handleDeleteFromCart = (product) => {
    cart = cart.filter((cartItem) => {
      return cartItem.product._id !== product._id;
    });
    if (user && !user.isAnonymous) {
      updateDB(cart, "currentOrder");
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    refreshPage();
  };

  return (
    <>
      <div className={styles.cartItem}>
        <div
          className={styles.deleteBtn}
          onClick={() => handleDeleteFromCart(props.cartItem.product)}
        >
          Xoá
        </div>
        <a
          href={`/product/${props.cartItem.product._id}`}
          className={styles.img}
        >
          <img src={props.cartItem.product.images[0]} alt="" />
        </a>
        <div className={styles.productCartInfo}>
          <div className={styles.title}>
            <a href={`/product/${props.cartItem.product._id}`}>
              {props.cartItem.product.name}
            </a>
          </div>
          <div className={styles.price}>
            {productPrice.toLocaleString("ko-KR", {
              style: "currency",
              currency: "VND",
            })}
          </div>
          <div className={styles.quantityWrapper}>
            <div
              className={styles.btnDecrease}
              onClick={() => handleDecreaseAmount()}
            >
              -
            </div>
            <input
              type="text"
              name=""
              value={quantity}
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
    </>
  );
}

export default CartItem;
