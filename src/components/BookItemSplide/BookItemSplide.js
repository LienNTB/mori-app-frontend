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
import * as types from "../../app/redux/types";

function BookItemSplide(props) {
  const router = useRouter();
  function getBookType(book) {
    if (book.access_level == 2) {
      return "book";
    }
    return book.chapters && book.chapters.length > 0 ? "audio-book" : "ebook";
  }

  return (
    <div className={styles.productItemSplideContainer}>
      <div className={styles.productThumbnail}>
        <a
          href={`/${getBookType(props.book)}/${props.book._id}`}
          prefetch={false}
          shallow
        >
          {props.book.image ? (
            <img
              src={`${types.BACKEND_URL}/api/bookimg/${props.book.image}`}
              alt="book name"
            />
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
