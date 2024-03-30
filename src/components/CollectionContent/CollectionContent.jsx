import styles from "./CollectionContent.module.scss";
import { Pagination } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import BookItem from "../BookItem/BookItem";
import ProductItem from "../ProductItem/ProductItem";
import TopFilter from "../TopFilter/TopFilter";
export async function getStaticProps() {
  var products = [];
  var res = await productApi.getProducts();
  products = res.data.products;

  let brandResponse = await brandApi.getBrands();
  const listBrands = [];
  for (const brand of brandResponse.data.brands) {
    listBrands.push(brand.name);
  }

  return {
    props: {
      products,
      listBrands,
    },
  };
}

function CollectionContent(props) {
  const [brandList, setBrandList] = useState([]);
  const [checkBrands, setCheckBrands] = useState([]);
  const [isAscName, setIsAscName] = useState(false);
  const [isDescName, setIsDescName] = useState(false);
  const [isAscPrice, setIsAscPrice] = useState(false);
  const [isDescPrice, setIsDescPrice] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(4 * 5);
  const numAllProducts = props.productList.length;
  const maxPages = Math.ceil(numAllProducts / productsPerPage);
  const getCurrentProducts = (currentPage, productsPerPage) => {
    let indexOfLastProduct = currentPage * productsPerPage;
    let indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    if (indexOfLastProduct >= numAllProducts) {
      indexOfLastProduct = numAllProducts;
    }
    return props.productList.slice(indexOfFirstProduct, indexOfLastProduct);
  };

  const [currentProducts, setCurrentProducts] = useState(
    getCurrentProducts(currentPage, productsPerPage)
  );

  const _ = useMemo(
    () => setCurrentProducts(getCurrentProducts(currentPage, productsPerPage)),
    [props.productList]
  );
  const isChecked = (brand) => {
    return checkBrands.includes(brand);
  };

  const handleChange = (_, value) => {
    setCurrentPage(value);
    setCurrentProducts(getCurrentProducts(value, productsPerPage));
  };
  const handleChangeFilter = (filterName) => {
    const name = filterName;
    console.log(name);
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
    } else {
      const clickedBrand = name;
      if (checkBrands.includes(clickedBrand)) {
        //if checked, uncheck
        setCheckBrands(checkBrands.filter((brand) => brand !== clickedBrand));
      } else {
        //if not check, check
        setCheckBrands([...checkBrands, clickedBrand]);
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
  // updated filtered by brands
  useEffect(() => {
    if (checkBrands.length === 0) {
      setCurrentProducts(props.productList);
    } else {
      const filteredProducts = props.productList.filter((product) =>
        checkBrands.includes(product.brand)
      );
      setCurrentProducts(filteredProducts);
    }
  }, [checkBrands]);
  return (
    <div className={styles.collectionContentContainer}>
      <div className={styles.header}>
        <label>Tất cả sản phẩm</label>
        <TopFilter
          className={styles.topFilter}
          brandList={brandList}
          handleChange={handleChangeFilter}
          isChecked={isChecked}
          isCheckedFilter={isCheckedFilter}
        />
      </div>

      <div className={styles.ruler}></div>
      <div className={styles.productList}>
        {currentProducts.map((productItem) => (
          <ProductItem
            id={productItem._id}
            itemsPerRow={4}
            product={productItem}
          />
        ))}
      </div>
      <div className={styles.pagination}>
        <Pagination
          count={maxPages}
          page={currentPage}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default CollectionContent;
