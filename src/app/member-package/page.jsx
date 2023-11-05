"use client"
import React, { useCallback, useEffect, useState } from 'react'
import styles from './member-package.module.scss'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { registerMembership } from '../redux/actions/membership'
import { UserAuth } from '../context/AuthContext'
import { createNewAccount, getCurrentAccount } from '../redux/actions/account'
import { toast } from "react-toastify";
import ToastContainerWrapper from '@/components/ToastContainerWrapper/ToastContainerWrapper'

const MemberPackage = () => {

  const [membertype, setMembertype] = useState(null);
  const dispatch = useDispatch()
  const currentAccount = useSelector(state => state.accounts.currentAccount);

  const { user } = UserAuth();

  console.log("currentAccount", currentAccount)

  // dung useCallback de xu li rerender
  const getCurrentUser = useCallback(() => {
    console.log("call back")
    if (user != null) {
      let newAccount = {
        email: user.email,
        displayName: user.displayName,
        avatar: user.photoURL,
      };
      dispatch(createNewAccount(newAccount));
      dispatch(getCurrentAccount(newAccount));
    }
  }, [user])

  useEffect(() => {
    getCurrentUser()
  }, [])

  const getCurrentDate = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    return `${year}-${month + 1}-${day}`
  }
  const getExpiredDate = () => {
    const currentDate = new Date()
    const expiredDate = new Date(currentDate)

    // define when expire date is on and calculate
    if (membertype === "year") expiredDate.setDate(currentDate.getDate() + 365)
    else if (membertype === "3month") expiredDate.setDate(currentDate.getDate() + 90)
    else if (membertype === "1month") expiredDate.setDate(currentDate.getDate() + 30)

    // transfer date to yy-mm-dd type
    const year = expiredDate.getFullYear();
    const month = expiredDate.getMonth();
    const day = expiredDate.getDate();
    return `${year}-${month + 1}-${day}`
  }
  const currentDate = new Date(getCurrentDate())
  const expiredDate = new Date(getExpiredDate()); // Set the expire date

  if (currentDate > expiredDate) {
    console.log('The expiration date has passed.'); // Perform actions for an expired date
  } else {
    console.log('The expiration date is still valid.'); // Perform actions for a valid date
  }

  console.log("currentAccount", currentAccount)
  const handleMemberRegisterBtnOnlick = () => {
    const membership = {
      user: currentAccount._id,
      type: membertype,
      start_date: getCurrentDate(),
      outdated_on: getExpiredDate()
    }
    var register = confirm("Bạn muốn đăng kí member?");
    if (register == true) {
      dispatch(registerMembership(membership));
      toast("Registered successfully!", {
        autoClose: 2000,
        type: "success",
      });
    }
  }


  return (
    <div className={styles.memberPackContainer}>
      <Header />
      <div className={styles.memberPackContent}>
        <div className={styles.banner}>
          <div className={styles.container}>
            <div className={styles.bannerContent}>
              <div className={styles.left}>
                <div className={styles.title}>
                  Website đọc sách online
                </div>
                <div className={styles.subTitle}>
                  #1 Việt Nam về sách đọc, sách nói
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.banner1}>
                  <img src="https://moristorage123.blob.core.windows.net/bookimg/banner1.webp" alt="banner1" />
                </div>
                <div className={styles.banner2}>
                  <img src="https://moristorage123.blob.core.windows.net/bookimg/banner2.webp" alt="banner2" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.packageList}>
          <div className={styles.packageItem}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>
                Gói năm
              </div>
              <div className={styles.bestPrice}>
                Giá tốt nhất
              </div>
            </div>
            <div className={styles.mainPrice}>
              899.000 ₫/Năm
            </div>
            <div className={styles.eachMonth}>
              (Chỉ còn 75.000 ₫ mỗi tháng)
            </div>
            <div className={styles.registerBtn} onClick={(() => {
              setMembertype("year");
              handleMemberRegisterBtnOnlick()
            })}>
              Mua gói năm
            </div>
          </div>

          <div className={styles.packageItem}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>
                Gói 3 tháng
              </div>
            </div>
            <div className={styles.mainPrice}>
              249.000 ₫/3 tháng
            </div>
            <div className={styles.eachMonth}>
              (Chỉ còn 83.000 ₫ mỗi tháng)
            </div>
            <div className={styles.registerBtn} onClick={(() => {
              setMembertype("3month");
              handleMemberRegisterBtnOnlick()
            })}>
              Mua gói 3 tháng
            </div>
          </div>
          <div className={styles.packageItem}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>
                Gói tháng
              </div>
            </div>
            <div className={styles.mainPrice}>
              99.000 ₫/Tháng
            </div>
            <div className={styles.eachMonth}>

            </div>
            <div className={styles.registerBtn} onClick={(() => {
              setMembertype("1month");
              handleMemberRegisterBtnOnlick()
            })}>
              Mua gói tháng
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainerWrapper />
    </div>
  )
}

export default MemberPackage
