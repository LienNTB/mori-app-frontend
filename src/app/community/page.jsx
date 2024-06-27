"use client"
import React, { useEffect, useState } from 'react'
import tempImg from '../../../public/book.png'
import Link from 'next/link';
import styles from './Community.module.scss'
import Tag from '@/components/Tag/Tag';
import Footer from '@/components/Footer/Footer';
import { getAllPostRequest } from '../redux/saga/requests/post';
import HeaderCommunity from '@/components/HeaderCommunity/Header';
import ReactHtmlParser from 'react-html-parser';
import Loading from '@/components/Loading/Loading';
import * as type from '../redux/types'

const Community = () => {
  const [postList, setPostList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastPost, setLastPost] = useState()
  useEffect(() => {
    setIsLoading(true)
    getAllPostRequest().then(resp => {
      setIsLoading(false)
      setPostList(resp.posts)
      setLastPost(resp.posts.length > 0 ? resp.posts.length - 1 : 0)
    })
      .catch(err => {
      })
  }, [])

  const isGoogleAvatar = (avatar) => {
    return avatar.startsWith('https://lh3.googleusercontent');
  }

  return (
    <div className={styles.communityContainer}>
      <HeaderCommunity />
      <div className={styles.communityContent}>
        {isLoading ?
          <Loading />
          :
          <>
            {
              postList.length > 0 ?
                <div >
                  <div className={styles.mainPost}>
                    <img className={styles.imgPost} src={postList[lastPost]?.image ? `${type.BACKEND_URL}/api/postimg/${postList[lastPost]?.image}` : tempImg} alt="main post img" />
                    <div className={styles.postInfo}>
                      <Link href={`/user/${postList[lastPost].account._id}/profile`} prefetch={false}>
                        <div className={styles.postItem}>
                          <img className={styles.userAvt}
                            src={isGoogleAvatar(postList[lastPost].account?.avatar) ?
                              postList[lastPost].account.avatar :
                              `${type.BACKEND_URL}/api/accountimg/${postList[lastPost].account.avatar}`}
                            alt="user avt" />
                          <div className={styles.name}>
                            {postList[lastPost]?.account?.displayName}
                          </div>
                        </div>
                      </Link>
                      <div className={styles.postItem}>
                        {new Date(postList[lastPost].created_at).toLocaleDateString('en-GB')}
                      </div>
                      <div className={styles.postItem}>
                        {
                          postList[lastPost].tag.map(tagItem => (
                            <div className={styles.tagItem}>
                              <Tag link={`/book-category/${tagItem.name}`} name={tagItem.description} className={styles.tagItem} />
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    <div className={styles.postTitle}>
                      <Link href={`/post/${postList[lastPost]._id}`} prefetch={false} >
                        {postList[lastPost].title}
                      </Link>
                    </div>
                    <div className={styles.postBody}>
                      {ReactHtmlParser(postList[lastPost].content)}
                    </div>
                  </div>
                  <div className={styles.postList}>
                    {
                      postList.map((post, index) => {
                        return (
                          index != lastPost &&
                          <div className={styles.postListItem}>
                            <img className={styles.imgPost} src={post?.image ? `${type.BACKEND_URL}/api/postimg/${post?.image}` : tempImg} alt="main post img" />
                            <div className={styles.postInfo}>
                              <Link href={`/user/${post.account._id}/profile`} prefetch={false}>
                                <div className={styles.postItem}>
                                  <img
                                    className={styles.userAvt}
                                    src={isGoogleAvatar(post.account.avatar) ? post.account.avatar : `${type.BACKEND_URL}/api/accountimg/${post.account.avatar}`}
                                    alt="user avt"
                                  />
                                  <div className={styles.name}>
                                    {post?.account?.displayName}
                                  </div>
                                </div>
                              </Link>

                              <div className={styles.postItem}>
                                {new Date(post.created_at).toLocaleDateString('en-GB')}
                              </div>
                            </div>
                            <div className={styles.tagList}>
                              {
                                post.tag.map(tagItem => (
                                  <div className={styles.tagItem}>
                                    <Tag link={`/book-category/${tagItem.name}`} prefetch={false} shallow name={tagItem.description} className={styles.tagItem} />
                                  </div>
                                ))
                              }
                            </div>
                            <div className={styles.postTitle}>
                              <Link href={`/post/${post._id}`} prefetch={false} >
                                {post.title}
                              </Link>
                            </div>
                            <div className={styles.postBody}>
                              {ReactHtmlParser(post.content)}
                            </div>
                          </div>)
                      }
                      )
                    }

                  </div>
                </div>
                :
                <></>
            }
          </>
        }
      </div>
      <Footer />
    </div >
  )
}

export default Community
