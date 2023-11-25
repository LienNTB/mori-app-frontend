import styles from "./BookItemSplide.module.scss";
import {
  faCartShopping,
  faEye,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import noImg from "../../../public/noImg.jpg";
import Loading from "../Loading/Loading";

function BookItemSplide(props) {
  const router = useRouter();

  return (
    <div className={styles.productItemSplideContainer}>
      <div className={styles.productThumbnail}>
        <a href={`/book/${props.book._id}`}>
          {props.book.image ? (
            <img src={props.book.image} alt="book name" />
          ) : (
            <Image src={noImg} />
          )}
        </a>
        <div className={styles.productAction}>
          <div className={styles.groupAction}>
            <div className={styles.actionBtn}>
              <FontAwesomeIcon icon={faCartShopping} />
            </div>
            <div className={styles.actionBtn}>
              <FontAwesomeIcon icon={faEye} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.productInfo}>
        <div className={styles.productName}>{props.book.name}</div>
      </div>
    </div>
  );
}

export default BookItemSplide;
