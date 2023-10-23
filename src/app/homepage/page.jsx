import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import React, { useState } from 'react'
import styles from "./homepage.module.scss"
import BookItem from '@/components/BookItem/BookItem'
import Tag from '@/components/Tag/Tag'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAccounts } from '../redux/actions/account'
import axios from "axios"


const HomePage = () => {
  const dispatch = useDispatch()
  const accounts = useSelector(state => state.accounts)
  const isLoading = useSelector(state => state.accounts.loading)
  const error = useSelector(state => state.accounts.error)

  console.log("accounts:", accounts)
  console.log("isLoading:", isLoading)
  useEffect(() => {
    dispatch(getAccounts());
  }, [dispatch]);

  // const [data, setData] = useState(null)
  // useEffect(() => {
  //   axios.get("http://localhost:8080/api/account/get-account")
  //     .then((res) => setData(res))
  //     .then(() => console.log("dong 26", data.data.accounts))
  // }, [])

  if (isLoading) {
    console.log("is loading...")
    return <>loading...</>
  }
  else {

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

                <Tag name="Tâm lý" link="tamly" />
                <Tag name="Tâm lý" link="tamly" />
                <Tag name="Tâm lý" link="tamly" />
                <Tag name="Tâm lý" link="tamly" />
                <Tag name="Tâm lý" link="tamly" />
                <Tag name="Tâm lý" link="tamly" />
                <Tag name="Tâm lý" link="tamly" />
                <Tag name="Tâm lý" link="tamly" />
                <Tag name="Tâm lý" link="tamly" />
                <Tag name="Tâm lý" link="tamly" />
                <Tag name="Tâm lý" link="tamly" />
                <Tag name="Tâm lý" link="tamly" />
                <Tag name="Tâm lý" link="tamly" /><Tag name="Tâm lý" link="tamly" />
                <Tag name="Tâm lý" link="tamly" />
                <Tag name="Tâm lý" link="tamly" /><Tag name="Tâm lý" link="tamly" />
              </div>
            </div>
          </section>
          <section className={styles.bookSectionContainer}>
            <div class={styles.sectionHeader}>
              <h3>Sách hay nên đọc</h3>
              <a title="Sách hay nên đọc" href="https://docsachhay.net/cat/tam-ly-ky-nang-song/xem-nhieu-nhat-thang" class="getmorebtn">Xem thêm</a>
            </div>
            <div className={styles.ruler}>

            </div>
            <div className={styles.sectionBody}>
              <div className={styles.bookList}>
                <div className={styles.bookItem}>
                  <BookItem />
                </div>
                <div className={styles.bookItem}>
                  <BookItem />
                </div>
                <div className={styles.bookItem}>
                  <BookItem />
                </div>
                <div className={styles.bookItem}>
                  <BookItem />
                </div>
                <div className={styles.bookItem}>
                  <BookItem />
                </div>
                <div className={styles.bookItem}>
                  <BookItem />
                </div>
                <div className={styles.bookItem}>
                  <BookItem />
                </div>
                <div className={styles.bookItem}>
                  <BookItem />
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    )
  }
}

export default HomePage
