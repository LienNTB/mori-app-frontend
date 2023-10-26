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

const Header = () => {
  const [isOpenListbox, setIsOpenListbox] = useState(false)
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
        <div className={styles.left}>
          <div className={styles.logo}>
            <Image src={logo} width={120} height={120} onClick={() => router.push("/")} />
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
          <li className={styles.bottomMenuItem}>Bảng xếp hạng</li>

        </ul>
      </div>
    </div >
  )
}

export default Header
