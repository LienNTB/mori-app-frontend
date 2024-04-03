import Header from '@/components/Header/Header'
import React from 'react'
import tempImg from '../../../../public/book.png'
import styles from './post.module.scss'
import Image from 'next/image'
import Tag from '@/components/Tag/Tag'
import Link from 'next/link'
import Footer from '@/components/Footer/Footer'
import Comment from '@/components/Comment/Comment'

const Post = () => {
  return (
    <div className={styles.postContainer}>
      <Header />
      <div className={styles.postContentWrapper}>
        <section className={styles.postMain}>
          <div className={styles.title}>
            What you need to know about Photography
          </div>
          <div className={styles.postInfo}>
            <div className={styles.postItem}>
              <Image className={styles.userAvt} src={tempImg} alt="user avt" />
              <div className={styles.name}>
                Mark Dinn
              </div>
            </div>
            <div className={styles.postItem}>
              03 Apr 2023
            </div>
            <div className={styles.postItem}>
              <Tag link={"/tamly"} name={"Tâm lý"} />
            </div>
          </div>
          <Image className={styles.postImage} src={tempImg} />
          <div className={styles.postBody}>
            dhsfiosfdfdsifdsifdifdoifdfdifdsfsdhsfiosfdfdsifdsifdifdoifdfdifdsfsdhsfiosfdfdsifdsifdifdoifdfdifdsfsdhsfiosfdfdsifdsifdifdoifdfdifdsfsdhsfiosfdfdsifdsifdifdoifdfdifdsfsdhsfiosfdfdsifdsifdifdoifdfdifdsfsdhsfiosfdfdsifdsifdifdoifdfdifdsfsdhsfiosfdfdsifdsifdifdoifdfdifdsfsdhsfiosfdfdsifdsifdifdoifdfdifdsfsdhsfiosfdfdsifdsifdifdoifdfdifdsfsdhsfiosfdfdsifdsifdifdoifdfdifdsfsdhsfiosfdfdsifdsifdifdoifdfdifdsfsdhsfiosfdfdsifdsifdifdoifdfdifdsfsdhsfiosfdfdsifdsifdifdoifdfdifdsfsdhsfiosfdfdsifdsifdifdoifdfdifdsfs
          </div>
        </section>
        <Comment />
        <section className={styles.similarPostWrapper}>
          <div className={styles.title}>
            Similar Posts
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
      <Footer />
    </div>
  )
}

export default Post
