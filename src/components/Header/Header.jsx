"use client"
import React from 'react'
import styles from "./Header.module.scss"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserAuth } from '@/app/context/AuthContext'


const Header = () => {
  const router = useRouter();
  const { user, logOut } = UserAuth();

  const handleSignOut = async () => {
    try {
      await logOut();
    }
    catch (err) {
      console.log(err)
    }
  }

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

        {user ? (<>
          <div className={styles.right} onClick={() => router.push("/account/profile")}>
            Tài khoản cá nhân
          </div>
          <div className={styles.right} onClick={handleSignOut}>
            Log out
          </div>
        </>)
          : (<div className={styles.right} onClick={() => router.push("/login")} >
            Login
          </div>)
        }
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
