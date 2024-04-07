"use client"
import React, { useEffect } from 'react'
import styles from "./Header.module.scss"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import logo from '../../../public/logo-nobg.png'
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useState } from 'react'
import { searchBooks, getBooksByCate } from '@/app/redux/actions/book'
import { useDispatch } from 'react-redux'
import { faBars, faCartArrowDown, faCartFlatbed, faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons'
import { getBookCategoryRequest } from '@/app/redux/saga/requests/category'
import { googleLogout } from '@react-oauth/google';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
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
    localStorage.removeItem("authenticated")
    localStorage.removeItem("user")
    window.location.replace("/login")
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
            <Link className={styles.right} href={"/member-package"} shallow>
              <div className={styles.memberRegisterBtn}>
                Tham gia hội viên
              </div>
            </Link>
            <div className={styles.right} >
              <Link href={"/account/profile"} shallow>
                Tài khoản của tôi
              </Link>
            </div>
            <Link className={styles.right} href={"/cart"} shallow>
              <FontAwesomeIcon
                icon={faCartShopping}
                class="cursor-pointer"
                width={20}
              />
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
              <div className={styles.searchBarContainer}>
                <input type="search" name="query" placeholder="Search Components" required="required" class="flex-1 h-10 px-4 m-1 text-gray-700 placeholder-gray-400 bg-transparent border-none appearance-none lg:h-12 dark:text-gray-200 focus:outline-none focus:placeholder-transparent focus:ring-0" />
                <button type="submit" class="flex items-center justify-center w-full p-2 m-1 text-white transition-colors duration-300 transform rounded-lg lg:w-12 lg:h-12 lg:p-0 bg-primary hover:bg-primary/70 focus:outline-none focus:bg-primary/70"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button>
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
                  Tài khoản của tôi
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
