"use client"
import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import React, { useCallback, useMemo, useState } from 'react'
import styles from "./homepage.module.scss"
import BookItem from '@/components/BookItem/BookItem'
import Tag from '@/components/Tag/Tag'
import { UserAuth } from '@/app/context/AuthContext'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getBooks } from '../redux/actions/book'
import Loading from '@/components/Loading/Loading'
import { createNewAccount, getCurrentAccount } from '../redux/actions/account'
import { toast } from "react-toastify";

const HomePage = (props) => {
  const dispatch = useDispatch();
  const books = props.books;
  const tags = props.tags
  const currentAccount = useSelector(state => state.accounts.currentAccount);
  const { user } = UserAuth();

  console.log("currentAccount", currentAccount)
  console.log("books:", books)
  console.log("tags:", tags)

  useEffect(() => {
    if (user != null && currentAccount == null) {
      let newAccount = {
        email: user.email,
        displayName: user.displayName,
        avatar: user.photoURL,
      };
      dispatch(getCurrentAccount(newAccount));
    }


  }, [])


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
          <div class={styles.sectionHeader}>
            <h3>Thể loại sách</h3>
          </div>
          <div className={styles.ruler}>

          </div>
          <div className={styles.sectionBody}>
            <div className={styles.tagList}>
              {
                tags.map((tag) => (
                  <Tag name={tag.description} link={`/theloai/${tag.name}`} />

                ))
              }


            </div>
          </div>
        </section>
        <section className={styles.bookSectionContainer}>
          <div class={styles.sectionHeader}>
            <h3>Sách hay nên đọc</h3>
            <a title="Sách hay nên đọc" href="/book-category/sach-hay"
              class="getmorebtn" >Xem thêm</a>
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
      </div>


      <Footer />
    </div>
  )
}


export default HomePage
