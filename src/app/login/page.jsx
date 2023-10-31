"use client"
import React from 'react'
import styles from './login.module.scss'
import { UserAuth } from '@/app/context/AuthContext'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { createNewAccount, getCurrentAccount } from "../redux/actions/account"
import { useSelector } from 'react-redux'
const Login = () => {
  const { user, googleSignIn, facebookSignIn } = UserAuth();
  const dispatch = useDispatch()

  const currentAccount = useSelector(state => state.accounts.currentAccount)

  const handleSignInGoogle = async () => {
    try {
      await googleSignIn();
      let newAccount = {
        email: user.email,
        displayName: user.displayName,
        avatar: user.photoURL,
        role: 0,
        is_member: false,
        is_blocked: false,
      }
      dispatch(createNewAccount(newAccount));
      dispatch(getCurrentAccount(newAccount))

    }
    catch (err) {
      console.log(err)
    }
  }
  const handleSignInFacebook = async () => {
    console.log("dong 20")
    try {
      await facebookSignIn()
    }
    catch (err) {
      console.log(err)
    }
  }
  if (user) {
    redirect("/")
  }
  return (
    <div className={styles.loginContainer}>
      <div className={styles.main}>
        <p className={styles.sign} align="center">Chào mừng bạn đến với Mori</p>
        <div className={styles.loginButtons}>
          <button onClick={handleSignInGoogle} >
            <Image src="/google.png" width={20}
              height={20} />
            Tiếp tục với Google</button>
          <button onClick={handleSignInFacebook}><Image src="/facebook.png" width={20}
            height={20}

          />Tiếp tục với Facebook</button>
        </div>
      </div>
    </div>
  )
}

export default Login
