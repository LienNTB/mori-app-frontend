"use client"
import React, { useEffect } from 'react'
import styles from "./Header.module.scss"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserAuth } from '@/app/context/AuthContext'
import Image from "next/image";
import logo from '../../../public/logo-nobg.png'
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useState } from 'react'
import { searchBooks, getBooksByCate } from '@/app/redux/actions/book'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { getBookCategoryRequest } from '@/app/redux/saga/requests/category'
import Loading from '../Loading/Loading'

const Header = () => {
  const dispatch = useDispatch()
  const [isOpenListbox, setIsOpenListbox] = useState(false)
  const [isOpenMenuList, setIsOpenMenuList] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [categories, setCategories] = useState(null)
  const router = useRouter();
  const { user, logOut } = UserAuth();


  const handleOpenMenu = async () => {
    console.log("handleOpenMenu")
    setIsOpenListbox(p => !p)

    return new Promise((resolve, reject) => {
      getBookCategoryRequest()
        .then(res => {
          setCategories(res.bookCategories);
          console.log("res:", res.bookCategories);
          resolve();
        })
        .catch(error => {
          console.error("Error in handleOpenMenu:", error);
          reject(error);
        });
    });
  }
  const handleSignOut = async () => {
    try {
      await logOut();
      setAuthenticated(null)
      localStorage.removeItem("authenticated")
      localStorage.removeItem("user")
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    setAuthenticated(localStorage.getItem("authenticated"))
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.topMenu}>
        <div className={styles.menuLaptop}>
          <div className={styles.left}>
            <div className={styles.logo}>
              <Image src={logo} width={120} height={120} onClick={() => router.push("/")} />
            </div>
            <div className={styles.searchBarContainer}>
              <input type="text" placeholder='Nhập tên sách, tuyển tập, tác giả,...'
                onChange={(e) => setSearchValue(e.target.value)} />
              <Link href={`/search/${searchValue}`} shallow>
                <button onClick={() => { dispatch(searchBooks(searchValue)) }}>
                  Tìm kiếm
                </button>
              </Link>
            </div>
          </div>

          {authenticated ? (<>
            <Link className={styles.right} href={"/account/profile"} shallow>
              Tài khoản cá nhân
            </Link>
            <Link className={styles.right} href={"/member-package"} shallow>
              <div className={styles.memberRegisterBtn}>
                Tham gia hội viên
              </div>
            </Link>
            <div className={styles.right} onClick={() => handleSignOut()}>
              Đăng xuất
            </div>
          </>)
            : (
              <>
                <Link className={styles.right} href={"/member-package"} shallow>
                  <div className={styles.memberRegisterBtn}>
                    Tham gia hội viên
                  </div>
                </Link>
                <Link className={styles.right} href={"/login"} shallow>
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
              <div className={styles.searchBarContainer}>
                <input type="text" placeholder='Nhập tên sách, tuyển tập, tác giả,...'
                  onChange={(e) => setSearchValue(e.target.value)} />
                <Link href="/search" shallow>
                  <button onClick={() => { dispatch(searchBooks(searchValue)) }}>
                    Tìm kiếm
                  </button>
                </Link>
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
                <Link href="/book" shallow>
                  Sách đọc
                </Link>
              </div>
              <div className={styles.menuItem}>
                <Link href="/audio-book" shallow>
                  Sách nói
                </Link>
              </div>
              <div className={styles.menuItem}>
                <Link href="/ranking/sachdoc" shallow>
                  Bảng xếp hạng
                </Link>
              </div>
              <div className={styles.menuItem} >
                <Link href={"/account/profile"} shallow>
                  Tài khoản cá nhân
                </Link>
              </div>
              <div className={styles.menuItem} onClick={handleSignOut}>
                Đăng xuất
              </div>
              <div className={styles.menuItem} >
                <Link className={styles.right} href={"/member-package"} shallow>
                  <div className={styles.memberRegisterBtn}>
                    Tham gia hội viên
                  </div>
                </Link>
              </div>
            </>
              :
              <>
                <div className={styles.menuItem}>
                  Danh mục
                </div>
                <div className={styles.menuItem}>
                  <Link href="/book" shallow>
                    Sách đọc
                  </Link>
                </div>
                <div className={styles.menuItem}>
                  <Link href="/audio-book" shallow>
                    Sách nói
                  </Link>
                </div>
                <div className={styles.menuItem}>
                  <Link href="/ranking/sachdoc" shallow>
                    Bảng xếp hạng
                  </Link>
                </div>
                <div className={styles.menuItem} >
                  <Link href={"/login"} shallow>
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
          <Link href="/book" shallow>
            <li className={styles.bottomMenuItem}>Sách đọc</li>
          </Link>
          <Link href="/audio-book" shallow>
            <li className={styles.bottomMenuItem}>Sách nói</li>
          </Link>
          <Link href="/ranking/sachdoc" shallow>
            <li className={styles.bottomMenuItem}>Bảng xếp hạng</li>
          </Link>

        </ul>
      </div>
    </div >
  )
}

export default Header
