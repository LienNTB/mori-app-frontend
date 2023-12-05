"use client"
import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from "./audioHome.module.scss"
import BookItem from '@/components/BookItem/BookItem'
import Tag from '@/components/Tag/Tag'
import { useDispatch } from 'react-redux'
import { Pagination } from '@nextui-org/react'
import * as type from '../redux/types'
import { getAllAudioBookRequest, getAllEBookRequest } from '../redux/saga/requests/book'
import Loading from '@/components/Loading/Loading'

const AudioHomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState([])
  const itemsPerPage = 18;
  const totalPages = (Math.ceil(books.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = books.slice(startIndex, endIndex);

  useEffect(() => {
    console.log("fd")
    getAllAudioBookRequest().then(res => {
      setBooks(res.books)
    })
  }, [])
  return (

    <div className={styles.homePageContainer}>
      <Header />
      <div className={styles.homePageContent}>

        <section className={styles.bookSectionContainer}>
          <div class={styles.sectionHeader}>
            <h3>Sách hay nên đọc</h3>
            <a title="Sách hay nên đọc" href="/book-category/sach-hay"
              class="getmorebtn" >Xem thêm</a>
          </div>
          <div className={styles.ruler}>

          </div>
          <div className={styles.sectionBody}>
            {books.length == 0 ? <Loading /> :
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
              </div>}
          </div>
        </section>
      </div>
      <div className={styles.pagination} >

        <Pagination total={totalPages} initialPage={1}
          page={currentPage}
          onChange={setCurrentPage} />
      </div>
      <Footer />
    </div>

  )
}


export default AudioHomePage
