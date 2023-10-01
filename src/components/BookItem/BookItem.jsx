import React from 'react'
import styles from "./BookItem.module.scss"
import Link from 'next/link'
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
const BookItem = () => {
  return (
    <div className={styles.container}>
      <Link href="/book/1">
        <img src="https://docsachhay.net/images/e-book/tuyen-tap-hat-giong-tam-hon.jpg" alt="img" />
      </Link>
      <h4 >Tuyển tập Hạt Giống Tâm Hồn</h4>
      <div className={styles.rating}>
        <Stack spacing={1}>
          <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
        </Stack>
      </div>
    </div>
  )
}

export default BookItem
