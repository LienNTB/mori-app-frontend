"use client"
import Header from '@/components/Header/Header'
import React, { useEffect, useState } from 'react'
import tempImg from '../../../../public/book.png'
import styles from './post.module.scss'
import Image from 'next/image'
import Tag from '@/components/Tag/Tag'
import Link from 'next/link'
import Footer from '@/components/Footer/Footer'
import Comment from '@/components/Comment/Comment'
import ReactHtmlParser from 'react-html-parser';
import { getPostByIdRequest, likePostRequest, sharePostRequest } from '@/app/redux/saga/requests/post'
import { useParams } from 'next/navigation'
import Loading from '@/components/Loading/Loading'
import { faHeart, faShare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as types from '../../redux/types'
import { useDispatch, useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { addNewCommentRequest } from '@/app/redux/saga/requests/comment'
import { getAllComments, setComments } from '@/app/redux/actions/comment'
import toast from 'react-hot-toast'
import { FacebookButton, FacebookCount } from "react-social";
import HeaderCommunity from '@/components/HeaderCommunity/Header'

const Post = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const id = params.id
  const [post, setPost] = useState(null)
  const [currentAccount, setCurrentAccount] = useState(null)
  console.log('post', post)
  const isLoadingComments = useSelector((state) => state.comments.loading);
  const comments = useSelector((state) => state.comments.comments);
  const [commentInput, setCommentInput] = useState("")
  const [postLikes, setPostLikes] = useState(0)
  const [postShares, setPostShares] = useState(0)
  const [isPostLiked, setIsPostLiked] = useState(false)
  const [isPostShared, setIsPostShared] = useState(false)
  const onCommentInputChange = (value) => {
    setCommentInput(value)
  }
  const onCommentsUpdate = (value) => {
    dispatch(setComments(value))
  }
  const handleCreateComment = () => {
    if (commentInput == "") {
      toast.error("Vui lòng nhập nội dung bình luận!")
    }
    else {
      const request = {
        account: currentAccount._id,
        post: post._id,
        content: commentInput
      }
      toast.promise(
        new Promise((resolve, reject) => {
          addNewCommentRequest(request)
            .then((resp) => {
              console.log("resp")
              if (resp.message) {
                resolve("Thêm bình luận thành công!");
                dispatch(getAllComments(currentAccount._id, post._id))
              } else {
                reject(resp.error);
              }
            })
            .catch((err) => {
              reject("Gửi bình luận thất bại! Vui lòng thử lại")
            });
        }),
        {
          loading: "Processing...",
          success: (message) => message,
          error: (error) => error.message,
        })
    }
    setCommentInput("")
  }
  const handleLikePost = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        likePostRequest(post._id, currentAccount._id)
          .then((resp) => {
            if (resp.message) {
              resolve(resp.message);
              getPostData()
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

  }
  const handleSharePost = () => {
    sharePostRequest(post._id, currentAccount._id).then(resp => {
      console.log("resp", resp)
      if (resp.message) {
        getPostData()
      }
    })
  }
  const getPostData = () => {
    getPostByIdRequest(id).then(resp => {
      setPost(resp.post)
      setPostLikes(resp.post.likes.length)
      setPostShares(resp.post.shares.length)

    })
  }
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      setCurrentAccount(user)
    }
    getPostData()
  }, [])
  useEffect(() => {
    if (post && currentAccount) {
      const isLiked = post.likes.some(likedAccount => likedAccount.toString() === currentAccount._id)
      const isShared = post.shares.some(likedAccount => likedAccount.toString() === currentAccount._id)
      setIsPostLiked(isLiked)
      setIsPostShared(isShared)
    }
  }, [post, currentAccount])

  useEffect(() => {
    if (currentAccount && post) {
      console.log("dispatch(getAllComments(user._id, post._id))")
      dispatch(getAllComments(currentAccount._id, post._id))
    }
  }, [post])

  return (
    <div className={styles.postContainer}>
      <Toaster />
      <HeaderCommunity />
      {
        post ?
          <div className={styles.postContentWrapper}>
            <section className={styles.postMain}>
              <div className={styles.title}>
                {post.title}
              </div>
              <div className={styles.top}>
                <div className={styles.postInfo}>
                  <div className={styles.postItem}>
                    <img className={styles.imgAvt} 
                    src={post.account.avatar ? post.account.avatar : tempImg} alt="user avt" />
                    <div className={styles.name}>
                      {post?.account?.displayName}
                    </div>
                  </div>
                  <div className={styles.postItem}>
                    {new Date(post.created_at).toLocaleDateString('en-GB')}
                  </div>
                  <div className={styles.postItem}>
                    {
                      post.tag.map((tagItem) => (
                        <Tag link={`/${tagItem.name}`} name={tagItem.description} />
                      ))
                    }
                  </div>
                </div>
                <div className={styles.actionList}>
                  <span>{postLikes}</span>
                  <div className={isPostLiked ? styles.redHeart : styles.blackHeart} onClick={handleLikePost}>
                    <FontAwesomeIcon
                      icon={faHeart}
                      class="cursor-pointer"
                      width={20}
                    />
                  </div>
                  {/* <span>{postShares}</span> */}
                  <FacebookButton onClick={handleSharePost} className={styles.shareBtnContainer} url={`https://ebook.workon.space/post/${post._id}`} appId={types.FACEBOOK_APP_ID}>
                    <span>
                      {postShares}
                    </span>
                    <div className={isPostShared ? styles.blackShare : styles.blueShare} >
                      <FontAwesomeIcon
                        icon={faShare}
                        class="cursor-pointer"
                        width={20}
                      />
                    </div>
                  </FacebookButton>
                </div>
              </div>
              <img className={styles.imgPost} src={post?.image ? `${types.BACKEND_URL}/api/postimg/${post?.image}` : tempImg} alt="main post img" />
              <div className={styles.postBody}>
                {ReactHtmlParser(post.content)}
              </div>
            </section>
            {
              isLoadingComments ?
                <>Loading comments..</>
                :
                <Comment user={currentAccount._id} post={post._id}
                  handleCreateComment={handleCreateComment}
                  onCommentInputChange={onCommentInputChange}
                  commentInput={commentInput}
                  comments={comments}
                  onCommentsUpdate={onCommentsUpdate} />
            }
            <section className={styles.similarPostWrapper}>
              <div className={styles.title}>
                Bài viết được đề xuất
              </div>
              <div className={styles.similarPostList}>
                <div className={styles.similarPostItem}>
                  <Image src={tempImg} />
                  <div className={styles.postInfo}>
                    <div>03 Apr 2023</div>
                    <div>
                      <Tag link={'/cate'} name={'Tâm lý'} />
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
                      <Tag link={'/cate'} name={'Tâm lý'} />
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
                      <Tag link={'/cate'} name={'Tâm lý'} />
                    </div>
                  </div>
                  <div className={styles.postName}>
                    <Link href={'/link'}>
                      How to make toys from old Olarpaper
                    </Link>
                  </div>
                </div>
              </div>
            </section>

          </div>
          :
          <Loading />
      }
      <Footer />
    </div>
  )
}

export default Post
