"use client";
import BookCategory from '@/components/BookCategory/BookCategory'
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getBooks, getBooksByCate } from '../../redux/actions/book'
import { useParams } from 'next/navigation'

const Page = () => {
  const dispatch = useDispatch()
  const booksByCate = useSelector(state => state.books.booksByCate);
  const params = useParams();

  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);

  useEffect(() => {
    if (params.slug) {
      dispatch(getBooksByCate(params.slug));
    }
  }, [params.slug]);
  return (
    <>
      <BookCategory books={booksByCate} />
    </>
  )
}


export default Page
