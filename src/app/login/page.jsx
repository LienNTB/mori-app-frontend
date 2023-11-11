"use client"
import React, { useCallback, useEffect, useState } from 'react'
import styles from './login.module.scss'
import { UserAuth } from '@/app/context/AuthContext'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { createNewAccount, getCurrentAccount } from "../redux/actions/account"
import { useSelector } from 'react-redux'
import { toast } from "react-toastify";
import ToastContainerWrapper from '@/components/ToastContainerWrapper/ToastContainerWrapper'


const Login = () => {
  const { user, googleSignIn } = UserAuth();

  const [authenticated, setAuthenticated] = useState(localStorage.getItem("authenticated"))
  const dispatch = useDispatch()
  async function handleSignInGoogle() {
    try {
      const googleLogin = await googleSignIn()
      console.log("googleLogin:", googleLogin)
    }
    catch (err) {
      toast(err, {
        autoClose: 2000,
        type: "error",
      });
      console.log("err:", err)
    }

  }


  useEffect(() => {
    if (user) {
      let newAccount = {
        email: user.email,
        displayName: user.displayName,
        avatar: user.photoURL,
        role: 0,
        is_member: false,
        is_blocked: false,
      };
      dispatch(createNewAccount(newAccount));
      localStorage.setItem("authenticated", true);
      setAuthenticated(localStorage.getItem("authenticated"))
    }
  }, [user])

  useEffect(() => {
    if (authenticated) {
      redirect("/")
    }
  }, [authenticated])

  return (
    <div className={styles.loginContainer}>
      <div className={styles.main}>
        <p className={styles.sign} align="center">Chào mừng bạn đến với Mori</p>
        <div className={styles.loginButtons}>
          <button onClick={() => handleSignInGoogle()} >
            <Image src="/google.png" width={20}
              height={20} />
            Tiếp tục với Google</button>
          {/* <button onClick={() => handleSignInFacebook()}><Image src="/facebook.png" width={20}
            height={20}

          />Tiếp tục với Facebook</button> */}
        </div>
      </div>
      <ToastContainerWrapper />

    </div>
  )
}

export default Login
