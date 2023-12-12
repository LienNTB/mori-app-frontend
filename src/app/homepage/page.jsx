"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import React, { useCallback, useMemo, useState } from "react";
import styles from "./homepage.module.scss";
import BookItem from "@/components/BookItem/BookItem";
import Tag from "@/components/Tag/Tag";
import { useDispatch } from "react-redux";
import { Pagination } from "@nextui-org/react";
import * as type from "../redux/types";

const HomePage = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const books = props.books;
  const tags = props.tags;
  const itemsPerPage = 18;
  const totalPages = Math.ceil(books?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = books?.slice(startIndex, endIndex);
  console.log("type", type);
  return (
    <div className={styles.homePageContainer}>
      <Header />
      <div className={styles.homePageContent}>
        <div className={styles.headContent}>
          <h1>Sách hay, hot, sách online miễn phí</h1>
          <h2>
            <i>Thư Viện Sách Ebook Miễn Phí</i>
          </h2>
          <div className={styles.description}>
            <p>
              Đọc Sách Hay được xây dựng nhằm chia sẻ sách ebook miễn phí cho
              những ai khó khăn, chưa có điều kiện mua sách. Hãy để sách trải
              đường trên hành trình đưa bạn đi đến sự khôn ngoan và hiểu biết
              hơn.
            </p>
            <p>
              Bản quyền sách thuộc về Tác giả &amp; Nhà xuất bản. Đọc Sách Hay
              khuyến khích các bạn nếu có khả năng hãy mua sách để ủng hộ Tác
              giả và Nhà xuất bản.
            </p>
          </div>
        </div>
        <section className={styles.bookSectionContainer}>
          <div className={styles.sectionHeader}>
            <h3>Thể loại sách</h3>
          </div>
          <div className={styles.ruler}></div>
          <div className={styles.sectionBody}>
            <div className={styles.tagList}>
              {tags?.map((tag, index) => (
                <Tag
                  key={index}
                  name={tag.description}
                  link={`/book-category/${tag.name}`}
                />
              ))}
            </div>
          </div>
        </section>
        <section className={styles.bookSectionContainer}>
          <div className={styles.sectionHeader}>
            <h3>Sách hay nên đọc</h3>
            <a
              title="Sách hay nên đọc"
              href="/book-category/sach-hay"
              class="getmorebtn"
            >
              Xem thêm
            </a>
          </div>
          <div className={styles.ruler}></div>
          <div className={styles.sectionBody}>
            <div className={styles.bookList}>
              {displayedItems?.map((book) => {
                return (
                  <div className={styles.bookItem}>
                    <BookItem book={book} key={book._id} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      <div className={styles.pagination}>
        <Pagination
          total={totalPages}
          initialPage={1}
          page={currentPage}
          onChange={setCurrentPage}
        />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
