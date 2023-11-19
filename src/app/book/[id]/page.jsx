"use client"
import { faEye, faEyeDropper, faHeart, faSave, faStar } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Tag from '@/components/Tag/Tag';
import styles from './book.module.scss'
import { getBookById, getBooks, getBooksByCate, increaseTotalSaved } from '@/app/redux/actions/book';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { redirect, useParams } from 'next/navigation'
import Loading from '@/components/Loading/Loading';
import BookItem from '@/components/BookItem/BookItem';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addBookToLibrary } from '@/app/redux/actions/myLibrary';
import { Toaster, toast } from "react-hot-toast";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/sea-green";
import "@splidejs/react-splide/css/core";
import { UserAuth } from '@/app/context/AuthContext';
import { getCurrentAccount } from '@/app/redux/actions/account';
import * as libraryRequest from '../../redux/saga/requests/myLibrary'
import { Badge } from "@nextui-org/react";
import BookItemSplide from '@/components/BookItemSplide/BookItemSplide';


function Book() {
  const { user } = UserAuth()
  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.books.loading)
  const book = useSelector(state => state.books.book);
  const booksByCate = useSelector(state => state.books.booksByCate);
  const currentAccount = useSelector(state => state.accounts.currentAccount);
  const addBookResult = useSelector(state => state.myLibrary.message)
  // const [similarProducts, setSimilarProducts] = useState(similarProductList);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviewRating, setReviewRating] = useState("5/5");
  const [email, setEmail] = useState("");
  const [starHover, setStarHover] = useState(0);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // console.log("cate:", book.tags[0])
  console.log("booksByCate:", booksByCate)

  const params = useParams()
  const id = params.id;

  const handleSendReview = () => {
    if (name === "" || email === "" || title === "" || content === "") {
      toast("Vui lòng nhập đủ thông tin!", {
        hideProgressBar: true,
        autoClose: 2000,
        type: "info",
        position: "top-right",
      });
    } else {
      const review = {
        name: name,
        email: email,
        rating: reviewRating,
        title: title,
        content: content,
      };

      setName("");
      setEmail("");
      setReviewRating("5/5");
      setRating(5);
      setTitle("");
      setContent("");
    }
  };

  const handleSaveToLibrary = () => {
    var register = confirm(`Thêm sách ${book.name} vào thư viện?`);
    if (register == true) {
      var request = {
        user: currentAccount._id,
        book: book
      }
      dispatch(increaseTotalSaved(book._id, currentAccount._id))

      toast.promise(
        new Promise((resolve, reject) => {
          libraryRequest.addBookToLibraryRequest(request)
            .then((resp) => {
              if (resp === 0) {
                resolve("Thêm sách vào thư viện thành công!")
              }
              if (resp === 1) {
                reject(new Error("Sách đã tồn tại trong thư viện!"));
              }
            })
        }),
        {
          loading: "Processing...",
          success: (message) => message,
          error: (error) => error.message,
        }
      );

    }
  }
  const getCurrentUser = () => {
    if (user != null && currentAccount == null) {
      let newAccount = {
        email: user.email,
        displayName: user.displayName,
        avatar: user.photoURL,
      };
      dispatch(getCurrentAccount(newAccount));
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, [])

  useEffect(() => {
    dispatch(getBookById(id))
  }, [dispatch])
  useEffect(() => {
    if (book) {
      dispatch(getBooksByCate(book.tags[0]))
    }
  }, [book])


  if (isLoading) {
    return <Loading />
  }
  if (!user) {
    redirect("/login")
  }



  return (<>
    <div className={styles.bookContainer}>
      <Header />

      {book ? <div className={styles.bookContent}>
        <section className={styles.novelHeader}>
          <div className={styles.left}>
            <img class="" src={book.image}
              alt="book img" />
          </div>
          <div className={styles.right}>
            <div className={styles.mainHead}>
              <h1 className={styles.novelTitle}>{book.name}</h1>
              <div className={styles.author}>
                <span>Tác giả: </span>
                <a href="https://docsachhay.net/author/koga-fumitake-kishimi-ichiro" title={book.author} class="property-item">
                  <span>{book.author}</span>
                </a>
              </div>
              <div className={styles.rating}>
                <FontAwesomeIcon icon={faStar} width={25} height={25} style={{ color: "#f8d80d", }} />
                <FontAwesomeIcon icon={faStar} width={25} height={25} style={{ color: "#f8d80d", }} />
                <FontAwesomeIcon icon={faStar} width={25} height={25} style={{ color: "#f8d80d", }} />
                <FontAwesomeIcon icon={faStar} width={25} height={25} style={{ color: "#f8d80d", }} />
                <FontAwesomeIcon icon={faStar} width={25} height={25} style={{ color: "#cfcfcf", }} />
              </div>
              <div className={styles.yourRating}>
                Đánh giá: 4.2/5 từ 28 lượt. Đánh giá của bạn?
              </div>
              <div className={styles.headerStats}>
                <div className={styles.statItem}>
                  <small>Lượt đọc</small>
                  <strong>
                    <FontAwesomeIcon className={styles.icon} icon={faEye} width={20} height={20} />{book.totalRead}
                  </strong>
                </div>
                <div className={styles.statItem}>
                  <small>Lượt thích</small>
                  <strong>
                    <FontAwesomeIcon className={styles.icon} icon={faHeart} width={20} height={20} />{book.totalHearted}
                  </strong>
                </div>
                <div className={styles.statItem}>
                  <small>Đánh dấu</small>
                  <strong>
                    <FontAwesomeIcon className={styles.icon} icon={faSave} width={20} height={20} />{book.totalSaved.length}
                  </strong>
                </div>
              </div>
              <div className={styles.category}>
                <div className={styles.title}>
                  Thể loại
                </div>
                <Link href={"/book-category/tamlykynang"}>
                  <button className={styles.tag}>Tâm lý - Kỹ năng sống</button>
                </Link>
              </div>
              <div className={styles.nextAction}>
                <Link href={book.pdf}>
                  <button className={styles.read}>Đọc ngay</button>
                </Link>
                <button className={styles.save} onClick={() => handleSaveToLibrary()}>Thêm vào thư viện</button>
                {/* <Link href={"/book-category/tamlykynang"}>
                </Link> */}
              </div>
            </div>
          </div>
        </section>
        <section className={styles.novelContent}>
          <div className={styles.title}>
            <h1>Giới thiệu</h1>
            <div className={styles.line}>

            </div>
          </div>
          <div className={styles.content}>
            {book.intro}
          </div>
          <div className={styles.tagWrapper}>
            <div className={styles.titleWrapper}>
              <h1>Tags</h1>
              <div className={styles.line}>
              </div>
            </div>
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

        <section className={styles.productReview}>
          <div className={styles.reviewHeader}>
            <div className={styles.writeReviewBtn}>Viết đánh giá</div>
          </div>
          <div className={styles.reviewForm}>
            <div className={styles.header}>Viết đánh giá mới</div>
            <fieldset>
              <label className={styles.title}>Đánh giá</label>
              <div className={styles.reviewStars}>
                {/* <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} /> */}

                {[...Array(5)].map((star, index) => {
                  index += 1;
                  return (
                    <FontAwesomeIcon
                      icon={faStar}
                      className={
                        index <= (starHover || rating)
                          ? styles.on
                          : styles.off
                      }
                      onClick={() => {
                        setRating(index);
                        setReviewRating(index + "/5");
                      }}
                      onMouseEnter={() => setStarHover(index)}
                      onMouseLeave={() => setStarHover(rating)}
                    />
                  );
                })}
              </div>
            </fieldset>
            <fieldset>
              <label>Nội dung</label>
              <textarea
                type="text"
                name=""
                placeholder="Viết nội dung đánh giá ở đây"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </fieldset>
            <div
              className={styles.sendReviewBtn}
              onClick={handleSendReview}
            >
              Gửi đánh giá
            </div>
          </div>
        </section>
        <section>
          <div className={styles.reviewTitleWrapper}>
            <h1 className={styles.header}>Đánh giá</h1>
            <div className={styles.ruler}></div>
          </div>
          <div className={styles.productReviewWrapper}>
            <div className={styles.reviewSidebar}>
              <div className={styles.ratingOverview}>
                <div className={styles.rating__current}>5</div>
                <div className={styles.rating__left}>
                  <div className={styles.ratingStars}>
                    <div className={styles.rating__star}>
                      <div className={styles.reviewStars}>
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                      </div>
                    </div>
                    <div className={styles.rating__secondary}>
                      (Đánh giá: 3)
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.starDetail}>
                <div className={styles.starLines}>
                  <div>5</div>
                  <div>
                    <FontAwesomeIcon
                      className={styles.star}
                      icon={faStar}
                    />
                  </div>

                  <progress
                    className={styles.starLine__line}
                    max="100"
                    value="100"
                  ></progress>
                  <div className={styles.starLine__percentage}>100%</div>
                </div>
                <div className={styles.starLines}>
                  <div>4</div>
                  <div>
                    <FontAwesomeIcon
                      className={styles.star}
                      icon={faStar}
                    />
                  </div>

                  <progress
                    className={styles.starLine__line}
                    max="100"
                    value="0"
                  ></progress>
                  <div className={styles.starLine__percentage}>100%</div>
                </div>
                <div className={styles.starLines}>
                  <div>3</div>
                  <div>
                    <FontAwesomeIcon
                      className={styles.star}
                      icon={faStar}
                    />
                  </div>

                  <progress
                    className={styles.starLine__line}
                    max="100"
                    value="0"
                  ></progress>
                  <div className={styles.starLine__percentage}>100%</div>
                </div>
                <div className={styles.starLines}>
                  <div>2</div>
                  <div>
                    <FontAwesomeIcon
                      className={styles.star}
                      icon={faStar}
                    />
                  </div>

                  <progress
                    className={styles.starLine__line}
                    max="100"
                    value="0"
                  ></progress>
                  <div className={styles.starLine__percentage}>100%</div>
                </div>
                <div className={styles.starLines}>
                  <div>1</div>
                  <div>
                    <FontAwesomeIcon
                      className={styles.star}
                      icon={faStar}
                    />
                  </div>

                  <progress
                    className={styles.starLine__line}
                    max="100"
                    value="0"
                  ></progress>
                  <div className={styles.starLine__percentage}>100%</div>
                </div>
              </div>
            </div>
            <div className={styles.reviewMainContent}>
              <div className={styles.reviewNavigation}>
                <div className={styles.reviewNavigationList}>
                  <div className={styles.reviewNavigationItemChoosen}>
                    All review
                  </div>
                  <div className={styles.reviewNavigationItem}>
                    <FontAwesomeIcon
                      className={styles.star}
                      icon={faStar}
                    />
                    <div
                      className={styles.reviewNavigationItem__starNumber}
                    >
                      5
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.ruler}></div>
              <div className={styles.reviewPosts}>
                <div className={styles.productReviewPost}>
                  <div className={styles.reviewCustomerWrapper}>
                    <div className={styles.reviewAvatar}>
                      <img
                        src="https://i.pinimg.com/564x/ba/8d/3b/ba8d3bdd8e3ba9335d3c28bd351ce183.jpg"
                        alt=""
                      />
                    </div>
                    <div className={styles.reviewProfileWrapper}>
                      <div className={styles.reviewCustomerName}>
                        Nguyễn Thị Dịu Hiền
                      </div>
                      <div className={styles.reviewProfile}>
                        <div className={styles.reviewTimeRating}>
                          <div className={styles.reviewTime}>
                            11/10/2021, 13:42
                          </div>
                          <div className={styles.reviewRating}>
                            <div className={styles.reviewStars}>
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.reviewContent}>
                    Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon
                    Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon
                  </div>
                </div>
                <div className={styles.productReviewPost}>
                  <div className={styles.reviewCustomerWrapper}>
                    <div className={styles.reviewAvatar}>
                      <img
                        src="https://i.pinimg.com/564x/ba/8d/3b/ba8d3bdd8e3ba9335d3c28bd351ce183.jpg"
                        alt=""
                      />
                    </div>
                    <div className={styles.reviewProfileWrapper}>
                      <div className={styles.reviewCustomerName}>
                        Nguyễn Thị Dịu Hiền
                      </div>
                      <div className={styles.reviewProfile}>
                        <div className={styles.reviewTimeRating}>
                          <div className={styles.reviewTime}>
                            11/10/2021, 13:42
                          </div>
                          <div className={styles.reviewRating}>
                            <div className={styles.reviewStars}>
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.reviewContent}>
                    Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon
                    Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon
                  </div>
                </div>
                <div className={styles.productReviewPost}>
                  <div className={styles.reviewCustomerWrapper}>
                    <div className={styles.reviewAvatar}>
                      <img
                        src="https://i.pinimg.com/564x/ba/8d/3b/ba8d3bdd8e3ba9335d3c28bd351ce183.jpg"
                        alt=""
                      />
                    </div>
                    <div className={styles.reviewProfileWrapper}>
                      <div className={styles.reviewCustomerName}>
                        Nguyễn Thị Dịu Hiền
                      </div>
                      <div className={styles.reviewProfile}>
                        <div className={styles.reviewTimeRating}>
                          <div className={styles.reviewTime}>
                            11/10/2021, 13:42
                          </div>
                          <div className={styles.reviewRating}>
                            <div className={styles.reviewStars}>
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.reviewContent}>
                    Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon
                    Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon
                  </div>
                </div>
                <div className={styles.productReviewPost}>
                  <div className={styles.reviewCustomerWrapper}>
                    <div className={styles.reviewAvatar}>
                      <img
                        src="https://i.pinimg.com/564x/ba/8d/3b/ba8d3bdd8e3ba9335d3c28bd351ce183.jpg"
                        alt=""
                      />
                    </div>
                    <div className={styles.reviewProfileWrapper}>
                      <div className={styles.reviewCustomerName}>
                        Nguyễn Thị Dịu Hiền
                      </div>
                      <div className={styles.reviewProfile}>
                        <div className={styles.reviewTimeRating}>
                          <div className={styles.reviewTime}>
                            11/10/2021, 13:42
                          </div>
                          <div className={styles.reviewRating}>
                            <div className={styles.reviewStars}>
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                              <FontAwesomeIcon icon={faStar} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.reviewContent}>
                    Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon
                    Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon Ngon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {!booksByCate ? <Loading /> :
          <section className={styles.moreProducts}>
            <div className={styles.header}>Sách cùng loại</div>
            <Splide
              className={styles.splideType1}
              options={{
                type: "loop",
                perPage: 1,
                perMove: 1,
              }}
              aria-label="My Favorite Images"
            >
              {!booksByCate ? <Loading /> :
                booksByCate.map((book) => (
                  <SplideSlide>
                    <BookItemSplide
                      itemsPerRow={1}
                      book={book}
                    />
                  </SplideSlide>
                ))}
            </Splide>
            <Splide
              className={styles.splideType2}
              options={{
                type: "loop",
                perPage: 3,
                perMove: 1,
              }}
              aria-label="My Favorite Images"
            >
              {!booksByCate ? <Loading /> :
                booksByCate.map((book) => (
                  <SplideSlide>
                    <BookItemSplide
                      itemsPerRow={1}
                      book={book}
                    />
                  </SplideSlide>
                ))}
            </Splide>
          </section>}
      </div> : <Loading />}
      <Footer />
      <Toaster />

    </div></>);
}
export default Book