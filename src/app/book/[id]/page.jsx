"use client";
import {
  faEllipsisVertical,
  faEye,
  faHeart,
  faSave,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import styles from "./book.module.scss";
import {
  getBookById,
  getBooksByCate,
  increaseTotalSaved,
} from "@/app/redux/actions/book";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toaster, toast } from "react-hot-toast";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/sea-green";
import "@splidejs/react-splide/css/core";
import * as libraryRequest from "../../redux/saga/requests/myLibrary";
import { Input, useDisclosure } from "@nextui-org/react";
import BookItemSplide from "@/components/BookItemSplide/BookItemSplide";
import {
  addNewOrUpdateReadHistory,
  increaseTotalReadDaily,
  increaseTotalHeartRequest,
  getRecommendationsOfBookRequest,
} from "@/app/redux/saga/requests/book";
import { createOrUpdateUserRecommendationsRequest } from "@/app/redux/saga/requests/account";
import { getMembershipByIdRequest } from "@/app/redux/saga/requests/membership";
import { getReviewsById } from "@/app/redux/actions/review";
import {
  deleteReviewRequest,
  reviewBookRequest,
  updateReviewRequest,
} from "@/app/redux/saga/requests/review";
import RatingStars from "@/components/RatingStars/RatingStars";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { getUserTransactionsRequest } from "@/app/redux/saga/requests/transaction";
import * as types from "@/app/redux/types";

function Book() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.books.loading);
  const book = useSelector((state) => state.books.book);
  const [productPrice, setProductPrice] = useState(0);
  const isLoadingReview = useSelector((state) => state.reviews.loading);
  const reviews = useSelector((state) => state.reviews.reviews);
  let [currentAccount, setCurrentAccount] = useState(null)
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const router = useRouter();
  const [isOpenReviewOption, setIsOpenReviewOption] = useState(false);
  const [isOpenReview, setIsOpenReview] = useState(null);
  const {
    isOpen: isOpenModifyReview,
    onOpen: onOpenModifyReview,
    onOpenChange: onOpenChangeModifyReview,
    onClose: onCloseChangeModifyReview,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteReview,
    onOpen: onOpenDeleteReview,
    onOpenChange: onOpenChangeDeleteReview,
    onClose: onCloseChangeDeleteReview,
  } = useDisclosure();
  const [currentReviewContent, setCurrentReviewContent] = useState("");
  const [reload, setReload] = useState(0);
  const [userTrans, setUserTrans] = useState();
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params.id;
  const redirectLogin = () => {
    currentAccount = JSON.parse(localStorage.getItem("user"));
    if (!currentAccount) {
      router.push("/login");
    }
  };

  const getUserTransactions = () => {
    getUserTransactionsRequest(currentAccount._id, "Book").then((resp) => {
      setUserTrans(resp.transactions);
    });
  };
  const handleUpdateReview = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        updateReviewRequest(isOpenReview._id, currentReviewContent)
          .then((resp) => {
            if (resp.message) {
              resolve(resp.mesage);
              onOpenChangeModifyReview();
              setReload((p) => p + 1);
            } else {
              reject(resp.error);
            }
          })
          .catch((err) => {

          });
      }),
      {
        loading: "Processing...",
        success: (message) => message,
        error: (error) => error.message,
      }
    );
    setReload((p) => p + 1);
  };
  const handleDeleteReview = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        deleteReviewRequest(isOpenReview._id)
          .then((resp) => {
            if (resp.message) {
              resolve("Review deleted successfully.");
              onCloseChangeDeleteReview();
              dispatch(getReviewsById(id));
            } else {
              reject(resp.error);
            }
          })
          .catch((err) => {

          });
      }),
      {
        loading: "Processing...",
        success: (message) => message,
        error: (error) => error.message,
      }
    );
  };

  const readBookSuccess = () => {
    increaseTotalReadDaily(book._id);
    if (currentAccount) {
      addNewOrUpdateReadHistory({
        book: book._id,
        user: currentAccount._id,
      });
      createOrUpdateUserRecommendationsRequest({
        user_id : currentAccount._id,
        book_id: book._id
      })
    }
    router.replace(`/reader/${book._id}`, undefined, { shallow: true });
  }

  const handleReadBook = async () => {
    if (!currentAccount) {
      toast.error("Vui lòng đăng nhập và mua sách để đọc sách này!", {
        duration: 2000,
      });
    } else {
      if (!checkBuyBook()) {
        toast.error("Vui lòng mua sách để đọc sách này!", {
          duration: 2000,
        });
      } else {
        readBookSuccess();
      }
    }
  };
  const handleIncreaseTotalHearted = async () => {
    toast.promise(
      new Promise((resolve, reject) => {
        increaseTotalHeartRequest(id)
          .then((resp) => {
            if (resp.message) {
              resolve("Hearted!");
            } else {
              reject("Error!");
            }
          })
          .catch((err) => {

          });
      }),
      {
        loading: "Processing...",
        success: (message) => message,
        error: (error) => error.message,
      }
    );
  };

  const handleSendReview = () => {
    if(!currentAccount){
      toast.error("Vui lòng đăng nhập để review sách", {
        duration: 2000,
      });
      redirectLogin();
    }
    else{
      const request = {
        user_id: currentAccount._id,
        book_id: id,
        rating: rating.toString(),
        content: content,
      };
      toast.promise(
        new Promise((resolve, reject) => {
          reviewBookRequest(request).then((resp) => {
            if (resp.message) {
              resolve("Thêm review thành công!");
              setReload((p) => p + 1);
            } else {
              reject(new Error("Thêm review thất bại!"));
            }
          });
        }),
        {
          loading: "Processing...",
          success: (message) => message,
          error: (error) => error.message,
        }
      );
      setContent("");
    }
  };

  const handleSaveToLibrary = () => {
    currentAccount = JSON.parse(localStorage.getItem("user"));
    if (!currentAccount) {
      toast.error("Vui lòng đăng nhập để thêm sách vào thư viện của bạn", {
        duration: 2000,
      });
    } else {
      var register = confirm(`Thêm sách ${book.name} vào thư viện?`);
      if (register == true) {
        var request = {
          user: currentAccount._id,
          book: book,
        };
        dispatch(increaseTotalSaved(book._id, currentAccount._id));

        toast.promise(
          new Promise((resolve, reject) => {
            libraryRequest.addBookToLibraryRequest(request).then((resp) => {
              if (resp === 0) {
                resolve("Thêm sách vào thư viện thành công!");
              }
              if (resp === 1) {
                reject(new Error("Sách đã tồn tại trong thư viện!"));
              }
            });
          }),
          {
            loading: "Processing...",
            success: (message) => message,
            error: (error) => error.message,
          }
        );
      }
    }
  };

  const handleSetBookRating = (ratingData) => {
    setRating(ratingData);
  };

  const checkBuyBook = () => {
    if (userTrans && userTrans.length > 0) {
      return userTrans.some((userTran) => {
        return userTran.product._id === book._id;
      });
    }
    return false;
  };

  const handleBuyEbook = () => {
    if (!currentAccount) {
      toast.error("Vui lòng đăng nhập và mua sách để đọc sách này!", {
        duration: 2000,
      });
    } else {
      if (!checkBuyBook()) {
        const price = book.price;
        const productId = book._id;
        var description = "Mua lẻ sách " + book.name;
        var type = "Book";
        var payment = {
          price: price,
          description: description,
          type: type,
          productId: productId,
        };
        localStorage.setItem("payment", JSON.stringify(payment));
        router.replace("/payment", undefined, { shallow: true });
      } else {
        toast.error("Bạn đã mua sách này, để đọc tiếp vui lòng chọn đọc ngay", {
          duration: 2000,
        });
      }
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await getRecommendationsOfBookRequest(id);
      setRecommendations(response.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getBookById(id));
    dispatch(getReviewsById(id));
    fetchRecommendations();
  }, [dispatch], [id]);

  useEffect(() => {
    dispatch(getReviewsById(id));
  }, [reload]);
  useEffect(() => {
    if (book) {
      setProductPrice(book.price);
      if(currentAccount){
        getUserTransactions();
      }
    }
  }, [book]);


  useEffect(() => {
    if (book) {
      dispatch(getBooksByCate(book.tags[0]));
    }
  }, [book]);
  useEffect(() => {
    setCurrentAccount(JSON.parse(localStorage.getItem("user")))
  }, [])

  if (isLoading && loading) {
    return <Loading />;
  }

  return (
    <>
      <div className={styles.bookContainer}>
        <Header />

        {book ? (
          <div className={styles.bookContent}>
            <section className={styles.novelHeader}>
              <div className={styles.left}>
                <img
                  class=""
                  src={`${types.BACKEND_URL}/api/bookimg/${book.image}`}
                  alt="book img"
                />
              </div>
              <div className={styles.right}>
                <div className={styles.mainHead}>
                  <h1 className={styles.novelTitle}>{book.name}</h1>
                  <div className={styles.author}>
                    <span>Tác giả: </span>
                    <a title={book.author} class="property-item">
                      <span>{book.author}</span>
                    </a>
                  </div>
                  <div className={styles.rating}>
                    <FontAwesomeIcon
                      icon={faStar}
                      width={25}
                      height={25}
                      style={{ color: "#f8d80d" }}
                    />
                    <FontAwesomeIcon
                      icon={faStar}
                      width={25}
                      height={25}
                      style={{ color: "#f8d80d" }}
                    />
                    <FontAwesomeIcon
                      icon={faStar}
                      width={25}
                      height={25}
                      style={{ color: "#f8d80d" }}
                    />
                    <FontAwesomeIcon
                      icon={faStar}
                      width={25}
                      height={25}
                      style={{ color: "#f8d80d" }}
                    />
                    <FontAwesomeIcon
                      icon={faStar}
                      width={25}
                      height={25}
                      style={{ color: "#cfcfcf" }}
                    />
                  </div>
                  <div className={styles.yourRating}>
                    Đánh giá: 4.2/5 từ 28 lượt. Đánh giá của bạn?
                  </div>
                  <div className={styles.headerStats}>
                    <div className={styles.statItem}>
                      <small>Lượt đọc</small>
                      <strong>
                        <FontAwesomeIcon
                          className={styles.icon}
                          icon={faEye}
                          width={20}
                          height={20}
                        />
                        {book.totalRead}
                      </strong>
                    </div>
                    <div className={styles.statItem}>
                      <small>Lượt yêu thích</small>
                      <strong>
                        <FontAwesomeIcon
                          className={styles.icon}
                          icon={faHeart}
                          width={20}
                          height={20}
                        />
                        {book.totalHearted}
                      </strong>
                    </div>
                    <div className={styles.statItem}>
                      <small>Đánh dấu</small>
                      <strong>
                        <FontAwesomeIcon
                          className={styles.icon}
                          icon={faSave}
                          width={20}
                          height={20}
                        />
                        {book.totalSaved.length}
                      </strong>
                    </div>
                  </div>
                  <div className={styles.category}>
                    <div className={styles.title}>Thể loại</div>
                    {book.tags.map((tag, index) => (
                      <React.Fragment key={index}>
                        <Link href={`/book-category/${tag}`} prefetch={false}  shallow>
                          <button className={styles.tag}>{tag}</button>
                        </Link>{" "}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className={styles.priceWrapper}>
                    <div className={styles.title}>Tạm tính</div>
                    <div className={styles.price}>
                      <div className={styles.originalPrice}>
                        {productPrice}đ
                      </div>
                      <div className={styles.discountPrice}>
                        {productPrice}đ
                      </div>
                      <div className={styles.discountTag}>-33%</div>
                    </div>
                  </div>
                  <div className={styles.nextAction}>
                    <button
                      className={styles.read}
                      onClick={() => handleReadBook()}
                    >
                      Đọc ngay
                    </button>
                    <button
                      className={styles.save}
                      onClick={() => handleSaveToLibrary()}
                    >
                      Thêm vào thư viện
                    </button>
                    <button
                      className={styles.purchaseBtn}
                      onClick={handleBuyEbook}
                    >
                      Mua lẻ ebook
                    </button>
                    <button
                      className={styles.save}
                      onClick={() => handleIncreaseTotalHearted()}
                    >
                      <FontAwesomeIcon
                        className={styles.icon}
                        icon={faHeart}
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </section>
            <section className={styles.novelContent}>
              <div className={styles.title}>
                <h1>Giới thiệu</h1>
                <div className={styles.line}></div>
              </div>
              <div className={styles.content}>{book.intro}</div>
            </section>
            <section className={styles.productReview}>
              <div className={styles.reviewHeader}>
                <div className={styles.writeReviewBtn}>Viết đánh giá</div>
              </div>
              <div className={styles.reviewForm}>
                <div className={styles.header}>Viết đánh giá mới</div>
                <fieldset>
                  <label className={styles.title}>Đánh giá</label>

                  <RatingStars
                    setRatingData={handleSetBookRating}
                    currentRating={5}
                  />
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
                  onClick={() => handleSendReview()}
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
                <div className={styles.reviewMainContent}>
                  <div className={styles.reviewNavigation}>
                    <div className={styles.reviewNavigationList}></div>
                  </div>
                  {isLoadingReview ? (
                    <Loading />
                  ) : (
                    <div className={styles.reviewPosts}>
                      {reviews.map((review) => (
                        <div
                          className={styles.productReviewPost}
                          key={review.id}
                        >
                          {review.user && (
                            <div className={styles.reviewCustomerWrapper}>
                              <div className={styles.info}>
                                <div className={styles.reviewAvatar}>
                                  {review.user.avatar && (
                                    <img
                                      src={`${types.BACKEND_URL}/api/accountimg/${review.user.avatar}`}
                                      alt="avatar"
                                    />
                                  )}
                                </div>
                                <div className={styles.reviewProfileWrapper}>
                                  <div className={styles.reviewCustomerName}>
                                    {review.user.displayName}
                                  </div>
                                  <div className={styles.reviewProfile}>
                                    <div className={styles.reviewTimeRating}>
                                      <div className={styles.reviewTime}>
                                        {review.postedDate}
                                      </div>
                                      <div className={styles.reviewRating}>
                                        <RatingStars
                                          setRatingData={handleSetBookRating}
                                          currentRating={review.rating}
                                          lockStar={true}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                key={review._id}
                                className={styles.option}
                                onClick={() => {
                                  setIsOpenReviewOption((p) => !p);
                                  setIsOpenReview(review);
                                  setCurrentReviewContent(review.content);
                                }}
                              >
                                <FontAwesomeIcon
                                  className={styles.menu}
                                  icon={faEllipsisVertical}
                                />

                                {isOpenReviewOption &&
                                  review.user._id === currentAccount?._id &&
                                  review._id === isOpenReview._id ? (
                                  // {isOpenReviewOption && isOpenReview._id === review._id
                                  <div className={styles.actionWrapper}>
                                    <div
                                      className={styles.actionItem}
                                      onClick={onOpenModifyReview}
                                    >
                                      Modify
                                    </div>
                                    <div className={styles.optionRuler}></div>
                                    <div
                                      className={styles.actionItem}
                                      onClick={onOpenDeleteReview}
                                    >
                                      Delete
                                    </div>
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          )}
                          <div className={styles.reviewContent}>
                            {review.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
            {!recommendations ? (
              <Loading />
            ) : (
              <section className={styles.moreProducts}>
                <div className={styles.header}>Sách cùng loại</div>
                <Splide
                  className={styles.splideType2}
                  options={{
                    type: 'loop',
                    perPage: 3,
                    perMove: 1,
                  }}
                  aria-label="My Favorite Images"
                >
                  {!recommendations ? (
                    <Loading />
                  ) : (
                    recommendations.map((book) => (
                      <SplideSlide key={book._id}>
                        <BookItemSplide itemsPerRow={1} book={book} />
                      </SplideSlide>
                    ))
                  )}
                </Splide>
              </section>
            )}
          </div>
        ) : (
          <Loading />
        )}
        <Footer />
        <Toaster />
      </div>
      <Modal
        placement="center"
        isOpen={isOpenModifyReview}
        onOpenChange={onOpenChangeModifyReview}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modify</ModalHeader>
              <ModalBody>
                <div className={styles.modifyWrapper}>
                  <div className={styles.userWrapper}>
                    <div className={styles.avatar}>
                      <img
                        src={`${types.BACKEND_URL}/api/accountimg/${isOpenReview.user.avatar}`}
                        alt="img"
                      />
                    </div>
                    <div className={styles.name}>
                      {isOpenReview.user.displayName}
                    </div>
                  </div>
                  <div className={styles.inputWrapper}>
                    <Input
                      value={currentReviewContent}
                      onChange={(e) => setCurrentReviewContent(e.target.value)}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose;
                    handleUpdateReview();
                  }}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        placement="center"
        isOpen={isOpenDeleteReview}
        onOpenChange={onOpenChangeDeleteReview}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete this review?
              </ModalHeader>
              <ModalBody>
                <div className={styles.modifyWrapper}>
                  <div className={styles.userWrapper}>
                    <div className={styles.avatar}>
                      <img
                        src={`${types.BACKEND_URL}/api/accountimg/${isOpenReview.user.avatar}`}
                        alt="img"
                      />
                    </div>
                    <div className={styles.name}>
                      {isOpenReview.user.displayName}
                    </div>
                  </div>
                  <div className={styles.inputWrapper}>
                    <Input value={isOpenReview.content} />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose;
                    handleDeleteReview();
                  }}
                >
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Book;
