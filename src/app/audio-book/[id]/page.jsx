"use client";
import {
  faEye,
  faEyeDropper,
  faHeart,
  faSave,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Tag from "@/components/Tag/Tag";
import styles from "./audiobook.module.scss";
import {
  getBookById,
  getBooks,
  getBooksByCate,
  increaseTotalSaved
} from "@/app/redux/actions/book";
import { useDispatch, useSelector } from "react-redux";
import React, { useRef, useEffect, useState, createRef } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toaster, toast } from "react-hot-toast";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/sea-green";
import "@splidejs/react-splide/css/core";
import * as types from "@/app/redux/types"
import * as libraryRequest from "../../redux/saga/requests/myLibrary";
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
import { ratingBookRequest, reviewBookRequest, getRatingsByBookRequest } from "@/app/redux/saga/requests/review";
import RatingStars from "@/components/RatingStars/RatingStars";

import "react-h5-audio-player/lib/styles.css";
import ChapterAudioPlayer from "@/components/ChapterAudioPlayer/ChapterAudioPlayer";

function AudioBookPage() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.books.loading);
  const book = useSelector((state) => state.books.book);
  const booksByCate = useSelector((state) => state.books.booksByCate);
  const isLoadingReview = useSelector((state) => state.reviews.loading);
  const reviews = useSelector((state) => state.reviews.reviews);
  let currentAccount = JSON.parse(localStorage.getItem("user"));
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviewRating, setReviewRating] = useState("5/5");
  const [email, setEmail] = useState("");
  const [starHover, setStarHover] = useState(0);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const [selectedChapter, setSelectedChapter] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [curTime, setCurTime] = useState(0);
  const params = useParams();
  const id = params.id;
  const [recommendations, setRecommendations] = useState("")
  const [loading, setLoading] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const onListenHandler = (e) => {
    setCurTime(e.target.currentTime);
  };
  const redirectLogin = () => {
    currentAccount = JSON.parse(localStorage.getItem("user"));
    if (!currentAccount) {
      router.push("/login");
    }
  };

  const readBookSuccess = () => {
    increaseTotalReadDaily(book._id);
    if (currentAccount) {
      addNewOrUpdateReadHistory({
        book: book._id,
        user: currentAccount._id,
      });
      createOrUpdateUserRecommendationsRequest({
        user_id: currentAccount._id,
        book_id: book._id
      })
    }
  }

  const handleReadBook = async (chapter) => {
    if (book.access_level === 0) {
      readBookSuccess();
      setSelectedChapter(chapter);
    } else {
      if (currentAccount == null) {
        toast.error(
          "Vui lòng đăng nhập và đăng ký gói cước người dùng để nghe sách này!",
          {
            duration: 2000,
          }
        );
      } else {
        const membershipRequest = await getMembershipByIdRequest(
          currentAccount._id
        );
        if (!membershipRequest.membership) {
          toast.error("Vui lòng đăng kí gói cước người dùng để nghe sách này!", {
            duration: 2000,
          });
        } else {
          readBookSuccess();
          setSelectedChapter(chapter);
        }
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
            console.log("err", err);
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
    if (!currentAccount) {
      toast.error("Vui lòng đăng nhập để review sách", {
        duration: 2000,
      });
      redirectLogin();
    }
    else {
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
    if (currentAccount !== null) {
      const request = {
        book_id: id,
        user_id: currentAccount._id,
        rating: rating
      }

      toast.promise(
        new Promise((resolve, reject) => {
          ratingBookRequest(request).then((resp) => {
            if (resp.message) {
              resolve("Thêm rating thành công!");
            }
            else {
              console.log("resp", resp.error)
              reject(resp.error);
            }
          });
        }),
        {
          loading: "Processing...",
          success: (message) => message,
          error: (error) => error,
        }
      );

    }
    else {
      toast.error("Vui lòng đăng nhập để đánh giá sách!")
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await getRecommendationsOfBookRequest(id);
      console.log('resp', response.recommendations);
      setRecommendations(response.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // const currentAccount = JSON.parse(localStorage.getItem('user'));
    // setCurrentAccount(currentAccount);
    dispatch(getBookById(id));
    dispatch(getReviewsById(id));
    fetchRecommendations();
    getRatingsByBookRequest(id).then((resp) => {
      setTotalReviews(resp.totalReviews);
      setAverageRating(resp.averageRating);
    });
  }, [id]);

  useEffect(() => {
    if (book) {
      dispatch(getBooksByCate(book.tags[0]));
    }
  }, [book]);

  if (isLoading && loading) {
    return <Loading />;
  }
  // if (!currentAccount) {
  //   redirect("/login")
  // }

  return (
    <>
      <div className={styles.bookContainer}>
        {/* <AudioPlayer
          className={styles.audioPlayerWrapper}
          src={selectedChapter.audio}
          ref={player}
        /> */}
        {/* <ReactAudioPlayer
          src={selectedChapter.audio}
          autoPlay
          controls
        /> */}
        <Header />
        {book ? (
          <div className={styles.bookContent}>
            <section className={styles.novelHeader}>
              <div className={styles.left}>
                <img class="" src={`${types.BACKEND_URL}/api/bookimg/${book.image}`} alt="book img" />
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
                    <RatingStars
                      setRatingData={handleSetBookRating}
                      currentRating={5}
                    />
                  </div>
                  {totalReviews == 0 ?
                  (
                    <div className={styles.yourRating}>
                      Sách chưa có lượt đánh giá
                    </div>
                  ) : (
                    <div className={styles.yourRating}>
                    Đánh giá: {averageRating}/5 từ {totalReviews} lượt. Đánh giá của bạn?
                    </div>
                    )
                  }
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
                    <div className={styles.tagList}>
                      {book.tags.map((tag, index) => (
                        <div className={styles.tagContainer}>
                          <Link href={`/book-category/${tag}`} prefetch={false} shallow>
                            {tag}
                          </Link>{" "}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.nextAction}>
                    <button
                      className={styles.save}
                      onClick={() => handleSaveToLibrary()}
                    >
                      Thêm vào thư viện
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

            <section>
              <div className={styles.novelContent}>
                <div className={styles.title}>
                  <h1>Danh sách chương</h1>
                  <div className={styles.line}></div>
                </div>
                <ListChapters
                  chapters={book.chapters}
                  onChapterClicked={(c) => {
                    handleReadBook(c);
                  }}
                />
                {selectedChapter && (
                  <ChapterAudioPlayer chapter={selectedChapter} book={book} />
                )}
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
                              <div className={styles.reviewAvatar}>
                                {review.user.avatar && (
                                  <img src={`${types.BACKEND_URL}/api/accountimg/${review.user.avatar}`} alt="avatar" />
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
          </div >
        ) : (
          <Loading />
        )
        }
        <Footer />
        <Toaster />
      </div >
    </>
  );
}

// ChapterItem component
function ChapterItem(props) {
  return (
    <div
      className="flex flex-row py-3 px-3 items-center gap-x-3 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
      onClick={props.onClick}
    >
      <div>{props.chapter.id}</div>
      <div className="flex-grow">{props.chapter.name}</div>
      <div>
        <button className={styles.listenBtn}>Nghe</button>
      </div>
    </div>
  );
}

// ListChapters component
function ListChapters({ chapters, onChapterClicked }) {
  return (
    <div className="flex flex-col gap-y-2">
      {chapters.map((chapter) => (
        <ChapterItem
          key={chapter.id}
          onClick={() => onChapterClicked?.(chapter)}
          chapter={chapter}
        />
      ))}
    </div>
  );
}

export default AudioBookPage;
