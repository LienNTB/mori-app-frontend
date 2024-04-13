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

const Community = () => {
  const [postList, setPostList] = useState([])
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
                    <Image className={styles.imgPost} src={tempImg} alt="main post img" />
                    <div className={styles.postInfo}>
                      <div className={styles.postItem}>
                        <Image className={styles.userAvt} src={tempImg} alt="user avt" />
                        <div className={styles.name}>
                          {postList[0]?.account.displayName}
                        </div>
                      </div>
                      <div className={styles.postItem}>
                        {new Date(postList[0].created_at).toLocaleDateString('en-GB')}
                      </div>
                      <div className={styles.postItem}>
                        <Tag link={"/tamly"} name={"Tâm lý"} />
                      </div>
                    </div>
                    <Link href={`/post/${postList[0]._id}`}>
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
                            <Image className={styles.imgPost} src={tempImg} alt="main post img" />
                            <div className={styles.postInfo}>
                              <div className={styles.postItem}>
                                <Image className={styles.userAvt} src={tempImg} alt="user avt" />
                                <div className={styles.name}>
                                  {post?.account?.displayName}
                                </div>
                              </div>
                              <div className={styles.postItem}>
                                {new Date(post.created_at).toLocaleDateString('en-GB')}
                              </div>
                              <div className={styles.postItem}>
                                <Tag link={"/tamly"} name={"Tâm lý"} />
                              </div>
                            </div>
                            <Link href={`/post/${post._id}`}>
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
