"use client";
import Header from "@/components/Header/Header";
import React, { useEffect, useState } from "react";
import tempImg from "../../../../public/book.png";
import styles from "./post.module.scss";
import Image from "next/image";
import Tag from "@/components/Tag/Tag";
import Link from "next/link";
import Footer from "@/components/Footer/Footer";
import Comment from "@/components/Comment/Comment";
import ReactHtmlParser from "react-html-parser";
import {
  getPostByIdRequest,
  likePostRequest,
  sharePostRequest,
} from "@/app/redux/saga/requests/post";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import { faEdit, faHeart, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as types from "../../redux/types";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { addNewCommentRequest } from "@/app/redux/saga/requests/comment";
import { getAllComments, setComments } from "@/app/redux/actions/comment";
import toast from "react-hot-toast";
import { FacebookButton, FacebookCount } from "react-social";
import HeaderCommunity from "@/components/HeaderCommunity/Header";
import { createNewNotificationRequest } from "@/app/redux/saga/requests/notification";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/sea-green";
import "@splidejs/react-splide/css/core";
import { getBooks, getBooksByCate } from "@/app/redux/actions/book";
import BookItemSplide from "@/components/BookItemSplide/BookItemSplide";

const Post = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const id = params.id;
  const [post, setPost] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  // console.log('post', post)
  const isLoadingComments = useSelector((state) => state.comments.loading);
  const comments = useSelector((state) => state.comments.comments);
  const [commentInput, setCommentInput] = useState("");
  const [postLikes, setPostLikes] = useState(0);
  const [postShares, setPostShares] = useState(0);
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [isPostShared, setIsPostShared] = useState(false);
  const booksByCate = useSelector((state) => state.books.booksByCate);
  const allbooks = useSelector((state) => state.books.books);


  const onCommentInputChange = (value) => {
    setCommentInput(value);
  };
  const onCommentsUpdate = (value) => {
    dispatch(setComments(value));
  };
  const handleCreateComment = () => {
    if (currentAccount) {
      if (commentInput == "") {
        toast.error("Vui lòng nhập nội dung bình luận!");
      } else {
        const request = {
          account: currentAccount._id,
          post: post._id,
          content: commentInput,
        };
        toast.promise(
          new Promise((resolve, reject) => {
            addNewCommentRequest(request)
              .then((resp) => {
                if (resp.message) {
                  resolve("Thêm bình luận thành công!");
                  dispatch(getAllComments(currentAccount._id, post._id));
                  createNewNotificationRequest(
                    post.account._id,
                    post._id,
                    "comment",
                    currentAccount._id,
                    commentInput
                  )
                } else {
                  reject(resp.error);
                }
              })
              .catch((err) => {
                reject("Gửi bình luận thất bại! Vui lòng thử lại");
              });
          }),
          {
            loading: "Processing...",
            success: (message) => message,
            error: (error) => error.message,
          }
        );
      }
      setCommentInput("");
    } else {
      toast.error("Vui lòng đăng nhập để bình luận bài viết này!", {
        duration: 2000,
      });
    }
  };
  const handleLikePost = () => {
    if (currentAccount) {
      toast.promise(
        new Promise((resolve, reject) => {
          likePostRequest(post._id, currentAccount._id)
            .then((resp) => {
              if (resp.message) {
                resolve(resp.message);
                getPostData();
                if (resp.message !== "Unhearted!") {
                  createNewNotificationRequest(
                    post.account._id,
                    post._id,
                    "like",
                    currentAccount._id,
                    ""
                  ).then((resp) => {
                  });
                }
              } else {
                reject("Like bài viết thất bại!");
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
    } else {
      toast.error("Vui lòng đăng nhập để like bài viết này!", {
        duration: 2000,
      });
    }
  };
  const handleSharePost = () => {
    if (currentAccount) {
      sharePostRequest(post._id, currentAccount._id).then((resp) => {
        // console.log("resp", resp)
        if (resp.message) {
          getPostData();
        }
      });
      createNewNotificationRequest(
        post.account._id,
        post._id,
        "share",
        currentAccount._id,
        ""
      )
    } else {
      toast.error("Vui lòng đăng nhập để share bài viết này!", {
        duration: 2000,
      });
    }
  };
  const getPostData = () => {
    getPostByIdRequest(id).then((resp) => {
      setPost(resp.post);
      setPostLikes(resp.post.likes.length);
      setPostShares(resp.post.shares.length);
      dispatch(getBooks());
      dispatch(getBooksByCate(resp.post.tag[0]));
    });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentAccount(user);
    }
    getPostData();
  }, []);
  useEffect(() => {
    if (post && currentAccount) {
      const isLiked = post.likes.some(
        (likedAccount) => likedAccount.toString() === currentAccount._id
      );
      const isShared = post.shares.some(
        (likedAccount) => likedAccount.toString() === currentAccount._id
      );
      setIsPostLiked(isLiked);
      setIsPostShared(isShared);
    }
  }, [post, currentAccount]);

  useEffect(() => {
    if (currentAccount && post) {
      dispatch(getAllComments(currentAccount._id, post._id));
    }
  }, [post]);

  return (
    <div className={styles.postContainer}>
      <Toaster />
      <HeaderCommunity />
      {post ? (
        <div className={styles.postContentWrapper}>
          <section className={styles.postMain}>
            <div className={styles.title}>{post.title}</div>
            <div className={styles.bookRedirect}>
              {post.book ?
                <Link href={`/book/${post.book._id}`} prefetch={false}>
                  <div>
                    Đọc sách "{post.book.name}" tại đây
                  </div>
                </Link>
                :
                <></>
              }
            </div>
            <div className={styles.top}>
              <div className={styles.postInfo}>

                <div className={styles.postItem}>
                  <img
                    className={styles.imgAvt}
                    src={
                      post?.account.avatar.includes("googleusercontent")
                        ? post.account.avatar
                        : `${types.BACKEND_URL}/api/accountimg/${post.account.avatar}`
                    }
                    alt="user avt"
                  />
                  <div className={styles.name}>
                    {post?.account?.displayName}
                  </div>
                </div>
                <div className={styles.postItem}>
                  {new Date(post.created_at).toLocaleDateString("en-GB")}
                </div>
                <div className={styles.postItem}>
                  {post.tag.map((tagItem) => (
                    <Tag link={`/${tagItem.name}`} name={tagItem.description} />
                  ))}
                </div>
              </div>

              <div className={styles.actionList}>
                <span>{postLikes}</span>
                <div
                  className={isPostLiked ? styles.redHeart : styles.blackHeart}
                  onClick={handleLikePost}
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    class="cursor-pointer"
                    width={20}
                  />
                </div>
                {/* <span>{postShares}</span> */}
                <FacebookButton
                  onClick={handleSharePost}
                  className={styles.shareBtnContainer}
                  url={`https://ebook.workon.space/post/${post._id}`}
                  appId={types.FACEBOOK_APP_ID}
                >
                  <span>{postShares}</span>
                  <div
                    className={
                      isPostShared ? styles.blackShare : styles.blueShare
                    }
                  >
                    <FontAwesomeIcon
                      icon={faShare}
                      class="cursor-pointer"
                      width={20}
                    />
                  </div>
                </FacebookButton>
                {currentAccount._id == post.account._id &&
                  <Link href={`/edit-post/${post._id}`}>
                    <FontAwesomeIcon
                      icon={faEdit}
                      class="cursor-pointer"
                      width={20}
                    />
                  </Link>
                }
              </div>
            </div>

            <img
              className={styles.imgPost}
              src={
                post?.image
                  ? `${types.BACKEND_URL}/api/postimg/${post?.image}`
                  : tempImg
              }
              alt="main post img"
            />
            <div className={styles.bookRedirect}>
              {post.book ?
                <Link href={`/book/${post.book._id}`} prefetch={false}>
                  <div>
                    Đọc sách "{post.book.name}" tại đây
                  </div>
                </Link>
                :
                <></>
              }
            </div>
            <div className={styles.postBody}>
              {ReactHtmlParser(post.content)}
            </div>
          </section>
          {isLoadingComments ? (
            <>Loading comments..</>
          ) : (
            <Comment
              user={currentAccount?._id}
              post={post._id}
              handleCreateComment={handleCreateComment}
              onCommentInputChange={onCommentInputChange}
              commentInput={commentInput}
              comments={comments}
              onCommentsUpdate={onCommentsUpdate}
            />
          )}
          {!booksByCate ? (
            <Loading />
          ) : (
            <section className={styles.moreProducts}>
              <div className={styles.header}>Đọc sách hay nhất tại Mori</div>
              <Splide
                className={styles.splideType1}
                options={{
                  type: "loop",
                  perPage: 3,
                  perMove: 1,
                }}
                aria-label="My Favorite Images"
              >
                {!booksByCate ? (
                  <Loading />
                ) : (
                  booksByCate.length != 0 ? booksByCate.map((book) => (
                    <SplideSlide>
                      <BookItemSplide itemsPerRow={3} book={book} />
                    </SplideSlide>
                  )) :
                    allbooks.map((book) => (
                      <SplideSlide>
                        <BookItemSplide itemsPerRow={3} book={book} />
                      </SplideSlide>
                    ))
                )}
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
                {!booksByCate ? (
                  <Loading />
                ) : (
                  booksByCate.length !== 0 ? booksByCate.map((book) => (
                    <SplideSlide>
                      <BookItemSplide itemsPerRow={3} book={book} />
                    </SplideSlide>
                  )) :
                    allbooks.map((book) => (
                      <SplideSlide>
                        <BookItemSplide itemsPerRow={3} book={book} />
                      </SplideSlide>
                    ))
                )}
              </Splide>
            </section>
          )}
          <section className={styles.similarPostWrapper}>
            <div className={styles.title}>Bài viết được đề xuất</div>
            <div className={styles.similarPostList}>
              <div className={styles.similarPostItem}>
                <Image src={tempImg} />
                <div className={styles.postInfo}>
                  <div>03 Apr 2023</div>
                  <div>
                    <Tag link={"/cate"} name={"Tâm lý"} />
                  </div>
                </div>
                <div className={styles.postName}>
                  How to make toys from old Olarpaper
                </div>
              </div>
              <div className={styles.similarPostItem}>
                <Image src={tempImg} />
                <div className={styles.postInfo}>
                  <div>03 Apr 2023</div>
                  <div>
                    <Tag link={"/cate"} name={"Tâm lý"} />
                  </div>
                </div>
                <div className={styles.postName}>
                  How to make toys from old Olarpaper
                </div>
              </div>
              <div className={styles.similarPostItem}>
                <Image src={tempImg} />
                <div className={styles.postInfo}>
                  <div>03 Apr 2023</div>
                  <div>
                    <Tag link={"/cate"} name={"Tâm lý"} />
                  </div>
                </div>
                <div className={styles.postName}>
                  <Link href={"/link"}>
                    How to make toys from old Olarpaper
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <Loading />
      )}
      <Footer />
    </div>
  );
};

export default Post;
