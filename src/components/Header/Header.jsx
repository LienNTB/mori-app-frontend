"use client"
import React from 'react'
import styles from "./Header.module.scss"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserAuth } from '@/app/context/AuthContext'
import Image from "next/image";
import logo from '../../../public/logo-nobg.png'
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useState } from 'react'
import { searchBooks } from '@/app/redux/actions/book'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  const dispatch = useDispatch()
  const [isOpenListbox, setIsOpenListbox] = useState(false)
  const [isOpenMenuList, setIsOpenMenuList] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const router = useRouter();
  const { user, logOut } = UserAuth();

  const handleSignOut = async () => {
    try {
      await logOut();
      localStorage.removeItem("authenticated")
    }
    catch (err) {
      console.log(err)
    }
  }

  const items = [
    {
      key: "tamli",
      label: "Tâm lí - kỹ năng sống",
    },
    {
      key: "triethoc",
      label: "Triết học",
    },
    {
      key: "vanhoc",
      label: "Văn học",
    },

  ];
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
              <Link href="/search">
                <button onClick={() => { dispatch(searchBooks(searchValue)) }}>
                  Tìm kiếm
                </button>
              </Link>
            </div>
          </div>

          {user ? (<>
            <Link className={styles.right} href={"/account/profile"}>
              Tài khoản cá nhân
            </Link>
            <Link className={styles.right} href={"/member-package"}>
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
                <Link className={styles.right} href={"/member-package"}>
                  <div className={styles.memberRegisterBtn}>
                    Tham gia hội viên
                  </div>
                </Link>
                <Link className={styles.right} href={"/login"} >
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
                <Link href="/search">
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
            {user ? <>
              <div className={styles.menuItem}>
                Danh mục
              </div>
              <div className={styles.menuItem}>
                <Link href="/ranking/sachdoc">
                  Sách đọc
                </Link>
              </div>
              <div className={styles.menuItem}>
                <Link href="/ranking/sachnoi">
                  Sách nói
                </Link>
              </div>
              <div className={styles.menuItem}>
                <Link href="/ranking/sachdoc">
                  Bảng xếp hạng
                </Link>
              </div>
              <div className={styles.menuItem} >
                <Link href={"/account/profile"}>
                  Tài khoản cá nhân
                </Link>
              </div>
              <div className={styles.menuItem} onClick={handleSignOut}>
                Đăng xuất
              </div>
              <div className={styles.menuItem} >
                <Link className={styles.right} href={"/member-package"}>
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
                  <Link href="/ranking/sachdoc">
                    Sách đọc
                  </Link>
                </div>
                <div className={styles.menuItem}>
                  <Link href="/ranking/sachnoi">
                    Sách nói
                  </Link>
                </div>
                <div className={styles.menuItem}>
                  <Link href="/ranking/sachdoc">
                    Bảng xếp hạng
                  </Link>
                </div>
                <div className={styles.menuItem} >
                  <Link href={"/login"}>
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
          <li className={styles.danhmuc} onClick={() => setIsOpenListbox(p => !p)}>Danh mục
            {isOpenListbox ? <div className={`${styles.listbox} w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100`}>
              <Listbox
                items={items}
                aria-label="Dynamic Actions"
                onAction={(key) => alert(key)}
                className={styles.listboxContent}
              >
                {
                  items.map(item => (
                    <ListboxItem
                      key={item.key}
                      color={"default"}
                    >
                      {item.label}
                    </ListboxItem>
                  ))
                }
              </Listbox>

            </div> : <></>}
          </li>
          <li className={styles.bottomMenuItem}>Sách đọc</li>
          <li className={styles.bottomMenuItem}>Sách nói</li>
          <Link href="/ranking/sachdoc">
            <li className={styles.bottomMenuItem}>Bảng xếp hạng</li>
          </Link>

        </ul>
      </div>
    </div >
  )
}

export default Header
