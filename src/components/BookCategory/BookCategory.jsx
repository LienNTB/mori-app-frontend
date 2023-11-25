"use client"
import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import React, { useEffect, useState } from 'react'
import styles from "./book-category.module.scss"
import BookItem from '@/components/BookItem/BookItem'
import Tag from '@/components/Tag/Tag'
import { useDispatch, useSelector } from 'react-redux'
import { getBooks } from '@/app/redux/actions/book'
import Loading from '@/components/Loading/Loading'
import { Pagination } from "@nextui-org/react";

const BookCategory = (props) => {
  console.log("props:", props)
  // console.log("books:", props.params)
  const dispatch = useDispatch()
  const books = props.books

  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);



  return (
    <div className={styles.homePageContainer}>
      <Header />

      <div className={styles.homePageContent}>
        <div className={styles.headContent} >
          <h1>Sách hay, hot, sách online miễn phí</h1>
          <h2><i>Thư Viện Sách Ebook Miễn Phí</i></h2>
          <div class={styles.description}>
            <p>Đọc Sách Hay được xây dựng nhằm chia sẻ sách ebook miễn phí cho những ai khó khăn, chưa có điều kiện mua sách. Hãy để sách trải đường trên hành trình đưa bạn đi đến sự khôn ngoan và hiểu biết hơn.</p>
            <p>Bản quyền sách thuộc về Tác giả &amp; Nhà xuất bản. Đọc Sách Hay khuyến khích các bạn nếu có khả năng hãy mua sách để ủng hộ Tác giả và Nhà xuất bản.</p>
          </div>
        </div>
        <section className={styles.bookSectionContainer}>
        </section>
        <section className={styles.bookSectionContainer}>
          <div class={styles.sectionHeader}>
            <h3>Sách theo thể loại</h3>
          </div>
          <div className={styles.ruler}>

          </div>
          <div className={styles.sectionBody}>
            <div className={styles.bookList}>
              {
                books.map(book => {
                  return (
                    <div className={styles.bookItem}>
                      <BookItem book={book} key={book._id} />
                    </div>
                  )
                })
              }

            </div>
          </div>
        </section>
        <div className={styles.pagination} >
          <Pagination total={10} initialPage={1}
            page={currentPage}
            onChange={setCurrentPage} />
        </div>
      </div>


      <Footer />
    </div>
  )
}


export default BookCategory
