import React from 'react'
import styles from "./BookItem.module.scss"
import Link from 'next/link'
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Image from 'next/image';

const BookItem = ({ book }) => {
  return (
    <div className={styles.container}>
      <Link href={`/book/${book._id}`}>
        <img src={book.image} alt="img" />
      </Link>
      <h4 >{book.name}</h4>
      <div className={styles.rating}>
        <Stack spacing={1}>
          <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
        </Stack>
      </div>
    </div>
  )
}

export default BookItem
