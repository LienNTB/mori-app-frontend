import React from "react";
import styles from "./BookItem.module.scss";
import Link from "next/link";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import * as types from '../../app/redux/types'

const BookItem = ({ book }) => {
  const hasChapters = book.chapters && book.chapters.length > 0;

  return (
    <div className={styles.container}>
      {hasChapters ? (
        <Link href={`/audio-book/${book._id}`} shallow>
          <img src={`${types.BACKEND_URL}/api/bookimg/${book.image}`} alt="img" />
        </Link>
      ) : (
        <Link href={`/ebook/${book._id}`} shallow>
          <img src={`${types.BACKEND_URL}/api/bookimg/${book.image}`} alt="img" />
        </Link>
      )}
      <h4>{book.name}</h4>
      <div className={styles.rating}>
        <Stack spacing={1}>
          <Rating
            name="half-rating-read"
            defaultValue={book.rating}
            precision={0.5}
            readOnly
          />
        </Stack>
      </div>

    </div>
  );
};

export default BookItem;
