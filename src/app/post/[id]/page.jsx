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
import { getPostByIdRequest } from '@/app/redux/saga/requests/post'
import { useParams } from 'next/navigation'
import Loading from '@/components/Loading/Loading'

const Post = () => {
  const params = useParams()
  const id = params.id
  const [post, setPost] = useState(null)
  console.log('post', post)
  useEffect(() => {
    getPostByIdRequest(id).then(resp => {
      setPost(resp.post)
    })
  }, [])
  return (
    <div className={styles.postContainer}>
      <Header />
      {
        post ?
          <div className={styles.postContentWrapper}>
            <section className={styles.postMain}>
              <div className={styles.title}>
                {post.title}
              </div>
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
                  {
                    post.tag.map((tagItem) => (
                      <Tag link={`/${tagItem.name}`} name={tagItem.description} />
                    ))
                  }
                </div>
              </div>
              <Image className={styles.postImage} src={tempImg} />
              <div className={styles.postBody}>
                {ReactHtmlParser(post.content)}
              </div>
            </section>
            <Comment />
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
