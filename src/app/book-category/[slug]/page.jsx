"use client";
import BookCategory from "@/components/BookCategory/BookCategory";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBooks, getBooksByCate } from "../../redux/actions/book";
import { useParams } from "next/navigation";
import { getUserRecommendationsRequest } from "../../redux/saga/requests/account"; 

const Page = () => {
  const [books, setBooks] = useState(null);
  const dispatch = useDispatch();
  const booksByCate = useSelector((state) => state.books.booksByCate);
  const allbooks = useSelector((state) => state.books.books);
  const params = useParams();
  const [userRecommendations, setUserRecommendations] = useState(null);

  const getRecommendation = (userId) => {
    getUserRecommendationsRequest(userId).then(resp => {
      console.log('resp', resp)
      setUserRecommendations(resp.recommendations)
    })
  }

  useEffect(() => {
    if (params.slug) {
      console.log("params.slug", params.slug)
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
      } else if(params.slug == "recommend" && JSON.parse(localStorage.getItem('user'))){
        getRecommendation(JSON.parse(localStorage.getItem('user'))._id);
      }
      else {
        dispatch(getBooksByCate(params.slug));
      }
    }
  }, [params.slug, allbooks]);
  return (
    <>
      {books ? (
        <BookCategory books={books[params.slug]} />
      ) : userRecommendations ? (
        <BookCategory books={userRecommendations} />
      ) : (
        <BookCategory books={booksByCate} />
      )}
    </>
  );
};

export default Page;
