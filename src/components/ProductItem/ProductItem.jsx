import styles from "./ProductItem.module.scss";
import {
  faCartShopping,
  faEye,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { toast } from "react-toastify";
import noImg from "../../../public/book.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

function ProductItem(props) {
  const router = useRouter();
  const [product, setProduct] = useState(props.product);
  const [quantity, setQuantity] = useState(1);
  let productWidth = "18%";
  if (props.itemsPerRow === 4) {
    productWidth = "25%";
  }
  if (props.itemsPerRow === 1) {
    productWidth = "80%";
  }
  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart"));

    cart.push({
      product,
      quantity: quantity,
    });


    localStorage.setItem("cart", JSON.stringify(cart));
    toast("Thêm vào giỏ hàng thành công!", {
      hideProgressBar: true,
      autoClose: 2000,
      type: "success",
      position: "top-right",
    });
  };
  return (
    <div
      onClick={() => {
        router.push(`/book/${props.id}`);
      }}
      className={styles.productItemContainer}
      styles={{ width: productWidth }}
    >
      <div className={styles.productThumbnail}>
        <a href="">
          {props.product.image ? (
            <img src={props.product.image} alt="product name" />
          ) : (
            <Image src={noImg} />
          )}
        </a>
        <div className={styles.productAction}>
          <div className={styles.groupAction}>
            <div className={styles.actionBtn} onClick={handleAddToCart}>
              <FontAwesomeIcon icon={faCartShopping} />
            </div>
            <div className={styles.actionBtn}>
              <FontAwesomeIcon icon={faEye} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.productInfo}>
        <div className={styles.productBrand}>{props.product.brand}</div>
        <div className={styles.productName}>{props.product.name}</div>
        <div className={styles.productPrice}>
          <div className={styles.newPrice}>
            1200000
          </div>
          {props.product?.initialPrice < props.salePrice ? (
            <div className={styles.oldPrice}>
              300000
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* <div className={styles.flashSaleBottom}>
        <div className={styles.flashSale__label}>
          <span>29</span> sản phẩm đã bán
        </div>
        <div className={styles.flashSale__proressbar}>
          <div className={styles.flashSale__percent}></div>
        </div>
      </div> */}
      <hr className={styles.seperate} />
    </div>

  );
}

export default ProductItem;
