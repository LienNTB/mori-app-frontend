"use client"
import React from 'react'
import styles from "./Header.module.scss"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Header = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.topMenu}>
        <div className={styles.left}>
          <div className={styles.logo}>
            logo
          </div>
          <form className={styles.searchBarContainer} action="/search">
            <input type="text" placeholder='Nhập tên sách, tuyển tập, tác giả,...' />
            <button type='submit'>
              Tìm kiếm
            </button>
          </form>
        </div>
        <div className={styles.right} onClick={() => router.push("/account/profile")}>
          Tài khoản cá nhân

        </div>
      </div>
      <div className={styles.bottomMenu}>
        <ul>
          <li>Danh mục</li>
          <li>Sách đọc</li>
          <li>Sách nói</li>
          <li>Bảng xếp hạng</li>

        </ul>
      </div>
    </div>
  )
}

export default Header
