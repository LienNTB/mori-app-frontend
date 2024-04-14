"use client"
import React, { useEffect } from 'react'
import styles from "./Header.module.scss"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import logo from '../../../public/logo-nobg.png'
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useState } from 'react'
import { getBooksByCate } from '@/app/redux/actions/book'
import { useDispatch } from 'react-redux'
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons'
import { getBookCategoryRequest } from '@/app/redux/saga/requests/category'
import { googleLogout } from '@react-oauth/google';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const HeaderCommunity = () => {
  const dispatch = useDispatch()
  const [isOpenListbox, setIsOpenListbox] = useState(false)
  const [isOpenMenuList, setIsOpenMenuList] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [categories, setCategories] = useState(null)
  const router = useRouter();

  const handleOpenMenu = async () => {
    setIsOpenListbox(p => !p)

    return new Promise((resolve, reject) => {
      getBookCategoryRequest()
        .then(res => {
          setCategories(res.bookCategories);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  const handleSignOut = async () => {
    googleLogout();
    setAuthenticated(null)
    localStorage.removeItem("user")
    window.location.replace("/login")
  }

  useEffect(() => {
    setAuthenticated(localStorage.getItem("user"))
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.topMenu}>
        <div className={styles.menuLaptop}>
          <div className={styles.left}>
            <div className={styles.logo}>
              <Image src={logo} width={120} height={120} onClick={() => router.push("/")} />
            </div>

          </div>

          {authenticated ? (
            <div className={styles.flexRightContainer}>
              <div className={styles.createNewPostBtn}>
                <Link href="/new-post" prefetch={false} >
                  Tạo post mới
                </Link>
              </div>
              <Link className={styles.right} href={"/account/profile"} prefetch={false}>

                Tài khoản của tôi
              </Link>
              <div className={styles.right} onClick={() => handleSignOut()}>
                Đăng xuất
              </div>
            </div>)
            : (
              <>
                <Link className={styles.right} href={"/member-package"} prefetch={false}>
                  <div className={styles.memberRegisterBtn}>
                    Tham gia hội viên
                  </div>
                </Link>
                <Link className={styles.right} href={"/login"} prefetch={false}>
                  Login
                </Link>
              </>
            )
          }
        </div>

        <div className={styles.menuMobile}>
          <div className={styles.menuWrapper}>
            <div className={styles.left}>
              <div className={styles.logo}>
                <Image src={logo} width={120} height={120} onClick={() => router.push("/")} />
              </div>
            </div>
            <div className={styles.right}>
              <FontAwesomeIcon className={styles.menu} icon={faBars} onClick={() => setIsOpenMenuList(p => !p)} />
            </div>

          </div>
          {isOpenMenuList ? <div className={styles.menuList}>
            {authenticated ? <>
              <div className={styles.menuItem}>
                Danh mục
              </div>
              <div className={styles.menuItem}>
                <Link href="/book" prefetch={false}>
                  Sách đọc
                </Link>
              </div>
              <div className={styles.menuItem}>
                <Link href="/audio-book" prefetch={false}>
                  Sách nói
                </Link>
              </div>
              <div className={styles.menuItem}>
                <Link href="/ranking/sachdoc" prefetch={false}>
                  Bảng xếp hạng
                </Link>
              </div>
              <div className={styles.menuItem} >
                <Link href={"/account/profile"} prefetch={false}>
                  <FontAwesomeIcon
                    icon={faUser}
                    class="cursor-pointer"
                    width={20}

                  />
                </Link>
              </div>
              <div className={styles.menuItem} onClick={handleSignOut}>
                Đăng xuất
              </div>

            </>
              :
              <>
                <div className={styles.menuItem}>
                  Danh mục
                </div>
                <div className={styles.menuItem}>
                  <Link href="/book" prefetch={false}>
                    Sách đọc
                  </Link>
                </div>
                <div className={styles.menuItem}>
                  <Link href="/audio-book" prefetch={false}>
                    Sách nói
                  </Link>
                </div>
                <div className={styles.menuItem}>
                  <Link href="/ranking/sachdoc" prefetch={false}>
                    Bảng xếp hạng
                  </Link>
                </div>
                <div className={styles.menuItem} >
                  <Link href={"/login"} prefetch={false}>
                    Đăng nhập
                  </Link>
                </div>

              </>
            }

          </div> : <></>}
        </div>
      </div>
      <div className={styles.bottomMenu}>
        <ul>
          <li className={styles.danhmuc} onClick={() => handleOpenMenu()}>Danh mục
            {isOpenListbox ?
              <div className={`${styles.listbox} w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100`}>
                {!categories ? <>...</> :
                  <Listbox
                    aria-label="Dynamic Actions"
                    // onAction={(key) => alert(key)}
                    className={styles.listboxContent}
                  >

                    {
                      categories.map(item => (

                        <ListboxItem
                          key={item.name}
                          color={"default"}
                        >
                          <a href={`/book-category/${item.tag}`} onClick={() => dispatch(getBooksByCate(`${item.tag}`))}>
                            {item.name}
                          </a>
                        </ListboxItem>

                      ))
                    }
                  </Listbox>}

              </div> : <></>}
          </li>
          <Link href="/book" prefetch={false}>
            <li className={styles.bottomMenuItem}>Sách đọc</li>
          </Link>
          <Link href="/audio-book" prefetch={false}>
            <li className={styles.bottomMenuItem}>Sách nói</li>
          </Link>
          <Link href="/ranking/sachdoc" prefetch={false}>
            <li className={styles.bottomMenuItem}>Bảng xếp hạng</li>
          </Link>

        </ul>
      </div>
    </div >
  )
}

export default HeaderCommunity
