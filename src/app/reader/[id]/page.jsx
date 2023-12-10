"use client"
import React, { useEffect, useState } from 'react'
import { ReactReader } from 'react-reader'
import styles from './reader.module.scss'
import { getBookById } from '@/app/redux/actions/book'
import { getBookByIdRequest } from '@/app/redux/saga/requests/book'
import { useParams } from 'next/navigation'
import Loading from '@/components/Loading/Loading'


const Reader = () => {
  const [location, setLocation] = useState(0)
  const params = useParams();
  const id = params.id;
  const [book, setBook] = useState(null)

  useEffect(() => {
    getBookByIdRequest(id).then(res => {
      setBook(res.book)
    })
  }, []);
  return (
    <div style={{ height: '100vh' }}>
      {!book ? <Loading /> :
        <ReactReader
          url="https://moristorage123.blob.core.windows.net/bookpdf/Emma.epub"
          location={location}
          locationChanged={(epubcfi) => setLocation(epubcfi)}
        />}
    </div>
  )
}

export default Reader
