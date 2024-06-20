"use client"
import React, { useEffect } from 'react'
import styles from "./Header.module.scss"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import logo from '../../../public/logo-nobg.png'
import { useState } from 'react'
import { getBooksByCate } from '@/app/redux/actions/book'
import { useDispatch } from 'react-redux'
import { faBars, faUser, faBell, faSignOut, faCircle } from '@fortawesome/free-solid-svg-icons'
import { getBookCategoryRequest } from '@/app/redux/saga/requests/category'
import { googleLogout } from '@react-oauth/google';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { ListboxWrapper } from '../ListboxWrapper/ListboxWrapper';
import { ListboxProfileWrapper } from '../ListboxWrapper/ListboxProfileWrapper'
import { getNotificationsRequest, markAllNotificationaAsReadRequest } from '@/app/redux/saga/requests/notification'
import * as timeUtils from '../../utils/timeUtils'
import * as types from "@/app/redux/types"
import readingGoalImg from '../../../public/readinggoal.png'
import { toast } from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'

const HeaderCommunity = () => {
  const dispatch = useDispatch()
  const [isOpenListbox, setIsOpenListbox] = useState(false)
  const [isOpenMenuList, setIsOpenMenuList] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [categories, setCategories] = useState(null)
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("")
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])

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

  const getNotificationsData = () => {
    getNotificationsRequest(currentAccount._id)
      .then(resp => {
        setNotifications([...resp.data].reverse())
      })
  }
  const handleMarkAsRead = (id) => {
    markNotificationaAsReadRequest(id)
  }
  const handleMarkAllAsRead = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        markAllNotificationaAsReadRequest(currentAccount._id)
          .then((resp) => {
            if (resp.message) {
              resolve(resp.message);
            } else {
              reject(resp.error);
            }
          })
          .catch((err) => {

          });
      }),
      {
        loading: "Processing...",
        success: (message) => message,
        error: (error) => error,
      }
    );
    getNotificationsData()
  }
  useEffect(() => {
    if (currentAccount) {
      getNotificationsData()
    }
  }, [currentAccount])
  useEffect(() => {
    setAuthenticated(localStorage.getItem("user"))
    setCurrentAccount(JSON.parse(localStorage.getItem("user")))
  }, [])
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  useEffect(() => {
    const unreadCount = notifications.filter(noti => !noti.isRead).length;
    setUnreadNotificationCount(unreadCount);
  }, [notifications]);
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
              <div className={styles.right}>
                <div className={styles.right}>
                  {unreadNotificationCount > 0 && (
                    <div className={styles.notificationCount}>
                      {unreadNotificationCount}
                    </div>
                  )}
                  <div
                    className={styles.notificationBtn}
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      setIsNotificationMenuOpen(p => !p);
                    }}
                  >
                    <FontAwesomeIcon icon={faBell} />
                  </div>
                </div>
                <div
                  className={styles.accountAvt}
                  onClick={() => {
                    setIsNotificationMenuOpen(false);
                    setIsAccountMenuOpen(p => !p);
                  }}
                >
                  <img
                    src={
                      currentAccount.avatar.includes("googleusercontent")
                        ? currentAccount.avatar
                        : `${types.BACKEND_URL}/api/accountimg/${currentAccount.avatar}`
                    }
                    alt="avt"
                  />
                </div>
                {isAccountMenuOpen && <div className={styles.menuAccount}>
                  <ListboxProfileWrapper>
                    <Listbox variant="flat" aria-label="Listbox menu with sections">
                      <ListboxSection >

                        <ListboxItem
                          key="new"
                          startContent={<FontAwesomeIcon icon={faUser} />}
                          onClick={() => router.replace("/account/profile", undefined, { shallow: true })}
                        >
                          Tài khoản của tôi
                        </ListboxItem>
                        <ListboxItem
                          key="new"
                          startContent={<FontAwesomeIcon icon={faSignOut} />}
                          onClick={() => handleSignOut()}
                        >
                          Đăng xuất
                        </ListboxItem>
                      </ListboxSection>

                    </Listbox>
                  </ListboxProfileWrapper>
                </div>}

                {isNotificationMenuOpen && <div className={styles.menuNotification}>
                  <ListboxWrapper >
                    <Listbox variant="flat" aria-label="Listbox menu with sections"
                      className={"max-h-80 overflow-y-scroll"}
                      topContent={<div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}
                      >
                        <div>Thông báo</div>
                        <div
                          style={{
                            fontWeight: "normal",
                            fontSize: "0.8rem",
                            paddingTop: "20px"
                          }}
                          onClick={() => handleMarkAllAsRead()}
                        >Đánh dấu tất cả đã đọc</div>
                      </div>}>
                      {
                        notifications.length == 0 ?
                          <ListboxItem
                            key="new"
                          >
                            Bạn chưa có thông báo nào.
                          </ListboxItem> :

                          notifications.map(noti => (
                            <ListboxItem
                              key="new"
                              onClick={() => {
                                !noti.isRead && handleMarkAsRead(noti._id);
                                router.replace(`/post/${noti.post._id}`, undefined, { shallow: true })
                              }}
                            >
                              <div className="flex gap-2 justify-between items-center">
                                <div className="flex gap-2 items-center">
                                  <Avatar alt="avt" className="flex-shrink-0" size="sm/[20px]" src={noti.performedBy ? noti.performedBy?.avatar
                                    : noti.performedBy && noti.performedBy?.avatar.includes("googleusercontent") ? `${types.BACKEND_URL}/api/accountimg/${noti.performedBy.avatar}`
                                      : { readingGoalImg }
                                  } />
                                  <div className="flex flex-col">
                                    <span className="text-sm/[17px] font-medium ">{
                                      noti.action == "comment" ? noti.performedBy :
                                        noti.action == "like" ? noti.performedBy :
                                          noti.action == "share" ? noti.performedBy :
                                            noti.action == "readingGoal" ? "Mục tiêu đọc sách" :
                                              noti.action == "voucher" ? "Chúc mừng bạn đã nhận được voucher!" :
                                                "Kiểm duyệt bình luận"
                                    }</span>
                                    <span className={`text-sm/[15px] ${noti.isRead ? "font-light" : "font-normal"} max-w-[230px] overflow-hidden whitespace-normal`}
                                      style={{ maxHeight: "46px" }}>
                                      {
                                        noti.action === "like" ? "Đã thích bài viết của bạn." :
                                          noti.action === "share" ? "Đã chia sẻ bài viết của bạn." :
                                            noti.action === "comment" ? `Đã bình luận bài viết của bạn: ${noti.message}` :
                                              noti.message
                                      }
                                    </span>
                                    <span className='text-sm/[12px] text-sky-600 font-medium my-1'>
                                      {timeUtils.getTimeElapsed(noti.createdAt)}
                                    </span>
                                  </div>
                                </div>
                                {!noti.isRead && <FontAwesomeIcon className={styles.newNotiIcon} icon={faCircle} />}

                              </div>
                            </ListboxItem>
                          ))
                      }
                    </Listbox>
                  </ListboxWrapper>
                </div>}
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
      <Toaster />
    </div >
  )
}

export default HeaderCommunity
