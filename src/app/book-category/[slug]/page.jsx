"use client";
import BookCategory from "@/components/BookCategory/BookCategory";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBooks, getBooksByCate } from "../../redux/actions/book";
import { useParams } from "next/navigation";

const Page = () => {
  const [books, setBooks] = useState(null);
  const dispatch = useDispatch();
  const booksByCate = useSelector((state) => state.books.booksByCate);
  const allbooks = useSelector((state) => state.books.books);
  const params = useParams();

  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);

  useEffect(() => {
    if (params.slug) {
      if (
        params.slug == "free" ||
        params.slug == "member" ||
        params.slug == "purchase"
      ) {
        const categorizedBooks = {
          free: allbooks.filter((book) => book.access_level == 0),
          member: allbooks.filter((book) => book.access_level == 1),
          purchase: allbooks.filter((book) => book.access_level == 2),
        };
        setBooks(categorizedBooks);
      } else {
        dispatch(getBooksByCate(params.slug));
      }
    }
  }, [params.slug, allbooks]);
  return (
    <>
      {books ? (
        <BookCategory books={books[params.slug]} />
      ) : (
        <BookCategory books={booksByCate} />
      )}
    </>
  );
};

export default Page;
