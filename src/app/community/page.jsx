"use client"
import React from 'react'
import Image from 'next/image';
import tempImg from '../../../public/book.png'
import Link from 'next/link';
import Header from '@/components/Header/Header';
import styles from './Community.module.scss'
import Tag from '@/components/Tag/Tag';

const Community = () => {
  return (
    <div className={styles.communityContainer}>
      <Header />
      <div className={styles.communityContent}>
        <div className={styles.mainPost}>
          <Image className={styles.imgPost} src={tempImg} alt="main post img" />
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
          <Link href="/post/123">
            <div className={styles.postTitle}>
              How to make toys from old Olarpaper
            </div>
          </Link>
          <div className={styles.postBody}>
            Nemo vel ad consectetur namut rutrum ex, venenatis sollicitudin urna. Aliquam erat volutpat. Integer eu ipsum sem. Ut bibendum lacus vestibulum maximus suscipit. Quisque vitae nibh iaculis n Nemo vel ad consectetur namut rutrum ex, venenatis sollicitudin urna. Aliquam erat volutpat. Integer eu ipsum sem. Ut bibendum lacus vestibulum maximus suscipit. Quisque vitae nibh iaculis neque bla
          </div>
        </div>
        <div className={styles.postList}>
          <div className={styles.postListItem}>
            <Image className={styles.imgPost} src={tempImg} alt="main post img" />
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
            <Link href="/post/123">
              <div className={styles.postTitle}>
                How to make toys from old Olarpaper
              </div>
            </Link>
            <div className={styles.postBody}>
              Nemo vel ad consectetur namut rutrum ex, venenatis sollicitudin urna. Aliquam erat volutpat. Integer eu ipsum sem. Ut bibendum lacus vestibulum maximus suscipit. Quisque vitae nibh iaculis n Nemo vel ad consectetur namut rutrum ex, venenatis sollicitudin urna. Aliquam erat volutpat. Integer eu ipsum sem. Ut bibendum lacus vestibulum maximus suscipit. Quisque vitae nibh iaculis neque bla
            </div>
          </div>
          <div className={styles.postListItem}>
            <Image className={styles.imgPost} src={tempImg} alt="main post img" />
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
            <Link href="/post/123">
              <div className={styles.postTitle}>
                How to make toys from old Olarpaper
              </div>
            </Link>
            <div className={styles.postBody}>
              Nemo vel ad consectetur namut rutrum ex, venenatis sollicitudin urna. Aliquam erat volutpat. Integer eu ipsum sem. Ut bibendum lacus vestibulum maximus suscipit. Quisque vitae nibh iaculis n Nemo vel ad consectetur namut rutrum ex, venenatis sollicitudin urna. Aliquam erat volutpat. Integer eu ipsum sem. Ut bibendum lacus vestibulum maximus suscipit. Quisque vitae nibh iaculis neque bla
            </div>
          </div>
          <div className={styles.postListItem}>
            <Image className={styles.imgPost} src={tempImg} alt="main post img" />
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
            <Link href="/post/123">
              <div className={styles.postTitle}>
                How to make toys from old Olarpaper
              </div>
            </Link>
            <div className={styles.postBody}>
              Nemo vel ad consectetur namut rutrum ex, venenatis sollicitudin urna. Aliquam erat volutpat. Integer eu ipsum sem. Ut bibendum lacus vestibulum maximus suscipit. Quisque vitae nibh iaculis n Nemo vel ad consectetur namut rutrum ex, venenatis sollicitudin urna. Aliquam erat volutpat. Integer eu ipsum sem. Ut bibendum lacus vestibulum maximus suscipit. Quisque vitae nibh iaculis neque bla
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Community
