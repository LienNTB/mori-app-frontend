"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import tempImg from '../../../public/book.png'
import Link from 'next/link';
import Header from '@/components/Header/Header';
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
  console.log("postList", postList)
  console.log("image test", `${type.BACKEND_URL}/postimg/${postList[0]?.image}`)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    getAllPostRequest().then(resp => {
      setIsLoading(false)
      setPostList(resp.posts)
    })
      .catch(err => {
        console.log("err", err)
      })
  }, [])
  return (
    <div className={styles.communityContainer}>
      <HeaderCommunity />
      <div className={styles.communityContent}>
        {isLoading ?
          <Loading />
          :
          <>
            {
              postList.length !== 0 ?
                <div >
                  <div className={styles.mainPost}>
                    <img className={styles.imgPost} src={postList[0]?.image ? `${type.BACKEND_URL}/api/postimg/${postList[0]?.image}` : tempImg} alt="main post img" />
                    <div className={styles.postInfo}>
                      <div className={styles.postItem}>
                        <img className={styles.userAvt} src={postList[0].account?.avatar ? postList[0].account.avatar : tempImg} alt="user avt" />
                        <div className={styles.name}>
                          {postList[0]?.account?.displayName}
                        </div>
                      </div>
                      <div className={styles.postItem}>
                        {new Date(postList[0].created_at).toLocaleDateString('en-GB')}
                      </div>
                      <div className={styles.postItem}>
                        {
                          postList[0].tag.map(tagItem => (
                            <div className={styles.tagItem}>
                              <Tag link={`/${tagItem.name}`} name={tagItem.description} className={styles.tagItem} />
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    <Link href={`/post/${postList[0]._id}`} prefetch={false} >
                      <div className={styles.postTitle}>
                        {postList[0].title}

                      </div>
                    </Link>
                    <div className={styles.postBody}>
                      {ReactHtmlParser(postList[0].content)}
                    </div>
                  </div>
                  <div className={styles.postList}>
                    {
                      postList.map((post, index) => {
                        return (
                          index != 0 &&
                          <div className={styles.postListItem}>
                            <img className={styles.imgPost} src={post?.image ? `${type.BACKEND_URL}/api/postimg/${post?.image}` : tempImg} alt="main post img" />
                            <div className={styles.postInfo}>
                              <div className={styles.postItem}>
                                <img className={styles.userAvt} src={post.account?.avatar ? post.account.avatar : tempImg} alt="user avt" />
                                <div className={styles.name}>
                                  {post?.account?.displayName}
                                </div>
                              </div>
                              <div className={styles.postItem}>
                                {new Date(post.created_at).toLocaleDateString('en-GB')}
                              </div>
                            </div>
                            <div className={styles.tagList}>
                              {
                                post.tag.map(tagItem => (
                                  <div className={styles.tagItem}>
                                    <Tag link={`/${tagItem.name}`} name={tagItem.description} className={styles.tagItem} />
                                  </div>
                                ))
                              }
                            </div>
                            <Link href={`/post/${post._id}`} prefetch={false} >
                              <div className={styles.postTitle}>
                                {post.title}
                              </div>
                            </Link>
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
