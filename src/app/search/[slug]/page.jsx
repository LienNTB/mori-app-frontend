"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import React, { useEffect, useState } from "react";
import styles from "./search.module.scss";
import BookItem from "@/components/BookItem/BookItem";
import Tag from "@/components/Tag/Tag";
import { useDispatch, useSelector } from "react-redux";
import { getBooks, searchBooks } from "../../redux/actions/book";
import Loading from "@/components/Loading/Loading";
import { Pagination } from "@nextui-org/react";
import { useParams } from "next/navigation";

const SearchBook = () => {
  const dispatch = useDispatch();
  const filteredBooks = useSelector((state) => state.books.filteredBooks);
  const isLoading = useSelector((state) => state.books.loading);
  const params = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;
  const totalPages = Math.ceil((filteredBooks?.length || 0) / itemsPerPage);

  useEffect(() => {
    dispatch(searchBooks(decodeURIComponent(params.slug)));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBooks());
  }, []);

  return (
    <div className={styles.homePageContainer}>
      <Header />
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.homePageContent}>
          <section className={styles.bookSectionContainer}>
            <div class={styles.sectionHeader}>
              <h3>Kết quả tìm</h3>
            </div>
            <div className={styles.ruler}></div>
            <div className={styles.sectionBody}>
              {filteredBooks && filteredBooks.length > 0 ? (
                <div className={styles.bookList}>
                  {filteredBooks.map((book) => {
                    return (
                      <div className={styles.bookItem}>
                        <BookItem book={book} key={book._id} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p
                  style={{
                    fontSize: "1.8em",
                    textAlign: "center",
                    marginTop: "40px",
                  }}
                >
                  Không tìm thấy quyển sách.
                </p>
              )}
            </div>
          </section>
        </div>
      )}
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

export default SearchBook;
