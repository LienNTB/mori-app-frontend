import BookInfo from '@/components/BookInfo/BookInfo'
import React from 'react'
import * as bookRequest from '../../redux/saga/requests/book'


async function generateStaticParams(id) {

  const res = await bookRequest.getBookByIdRequest(id)
  return ({
    book: res.book
  })

}

export default async function Book({ params: { id } }) {

  const book = await generateStaticParams(id)

  return (
    <div>
      <BookInfo bookInfo={book} />
    </div>
  )
}
