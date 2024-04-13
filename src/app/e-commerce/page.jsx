"use client"
import React, { useEffect, useState } from 'react'
import styles from './eCommerce.module.scss'
import Header from '@/components/Header/Header'
import { useDispatch, useSelector } from 'react-redux';
import { getBooks } from '../redux/actions/book';
import CollectionSidebar from '@/components/CollectionSidebar/CollectionSidebar';
import TopFilter from '@/components/TopFilter/TopFilter';
import CollectionContent from '@/components/CollectionContent/CollectionContent';
import Loading from '@/components/Loading/Loading';

const eCommerce = () => {
  const dispatch = useDispatch()
  const [domLoaded, setDomLoaded] = useState(false);
  const productList = useSelector(state => state.books.books)
  const [currentProducts, setCurrentProducts] = useState([]);
  const [isAscName, setIsAscName] = useState(false);
  const [isDescName, setIsDescName] = useState(false);
  const [isAscPrice, setIsAscPrice] = useState(false);
  const [isDescPrice, setIsDescPrice] = useState(false);


  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart") === null) {
      var cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      cart = JSON.parse(localStorage.getItem("cart"));

      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }


  const sortArray = (sortProperty, asc) => {
    const sorted = [...currentProducts].sort((a, b) => {
      if (sortProperty === "initialPrice") {
        if (asc) {
          return a[sortProperty] - b[sortProperty];
        } else {
          return b[sortProperty] - a[sortProperty];
        }
      } else {
        if (asc) {
          return a[sortProperty].localeCompare(b[sortProperty]);
        } else {
          return b[sortProperty].localeCompare(a[sortProperty]);
        }
      }
    });
    setCurrentProducts(sorted);
  };

  const handleChange = (filterName) => {
    const name = filterName;
    if (name === "ascName") {
      if (isAscName) {
        setIsAscName(false);
      } else {
        setIsDescName(false);
        setIsAscPrice(false);
        setIsDescPrice(false);
        setIsAscName(true);
        sortArray("name", true);
      }
    } else if (name === "descName") {
      if (isDescName) {
        setIsDescName(false);
      } else {
        setIsAscName(false);
        setIsAscPrice(false);
        setIsDescPrice(false);
        setIsDescName(true);
        sortArray("name", false);
      }
    } else if (name === "ascPrice") {
      //if ascPrice is true, set to true
      //esle check if descPrice is set to true,
      //if yes, change to false then change ascPrice to true
      if (isAscPrice) {
        setIsAscPrice(false);
      } else {
        setIsAscName(false);
        setIsDescName(false);
        setIsDescPrice(false);
        setIsAscPrice(true);
        sortArray("initialPrice", true);
      }
    } else if (name === "descPrice") {
      if (isDescPrice) {
        setIsDescPrice(false);
      } else {
        setIsAscName(false);
        setIsDescName(false);
        setIsAscPrice(false);
        setIsDescPrice(true);
        sortArray("initialPrice", false);
      }
    }
  };


  const isCheckedFilter = (name) => {
    if (name === "ascName") {
      return isAscName;
    } else if (name === "descName") {
      return isDescName;
    } else if (name === "ascPrice") {
      return isAscPrice;
    } else {
      return isDescPrice;
    }
  };

  useEffect(() => {
    dispatch(getBooks())
  }, [])

  useEffect(() => {
    setDomLoaded(true);
  }, []);
  return (
    <div className={styles.eCommerceContainer}>
      <Header />
      <div className={styles.container}>
        <div className={styles.collectionContainer}>
          <CollectionSidebar
            handleChange={handleChange}
          />
          <div className={styles.collectionContainer__right}>
            {
              productList.length !== 0 ?
                <CollectionContent productList={productList} /> : <Loading />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default eCommerce
