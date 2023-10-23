"use client"
import React from 'react'
import styles from "./Header.module.scss"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserAuth } from '@/app/context/AuthContext'
import Image from "next/image";
import logo from '../../../public/logo-nobg.png'


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
            <Image src={logo} width={120} height={120} />
          </div>
          <form className={styles.searchBarContainer} action="/search">
            <input type="text" placeholder='Nhập tên sách, tuyển tập, tác giả,...' />
            <button type='submit'>
              Tìm kiếm
            </button>
          </form>
        </div>

        {user ? (<>
          <Link className={styles.right} href={"/account/profile"}>
            Tài khoản cá nhân
          </Link>
          <div className={styles.right} onClick={handleSignOut}>
            Log out
          </div>
        </>)
          : (<Link className={styles.right} href={"/login"} >
            Login
          </Link>)
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
