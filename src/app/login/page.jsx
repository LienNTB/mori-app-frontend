"use client"
import React, { useCallback, useEffect, useState } from 'react'
import styles from './login.module.scss'
import { UserAuth } from '@/app/context/AuthContext'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { createNewAccount, getCurrentAccount } from "../redux/actions/account"
import { useSelector } from 'react-redux'
import { Toaster, toast } from "react-hot-toast";
import ToastContainerWrapper from '@/components/ToastContainerWrapper/ToastContainerWrapper'
import { Nunito } from 'next/font/google'
import { fontWeight } from '@mui/system'
import Link from 'next/link'
import { loginAccountRequest } from '../redux/saga/requests/account'


const Login = () => {
  const { user, googleSignIn } = UserAuth();
  const [authenticated, setAuthenticated] = useState(localStorage.getItem("authenticated"))
  const dispatch = useDispatch()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")


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

  const handleSignIn = () => {

    if (username == "" || password == "") {
      toast.error("Vui lòng nhập đủ thông tin!", {
        duration: 2000, position: 'top-center',
      })
    }
    else {
      const account = {
        username: username,
        password: password
      }
      toast.promise(
        new Promise((resolve, reject) => {
          loginAccountRequest(account)
            .then((resp) => {
              if (resp.msg) {
                resolve("Đăng nhập thành công!");
                localStorage.setItem("authenticated", true);
                localStorage.setItem("user", resp.user._id);
                setAuthenticated(localStorage.getItem("authenticated"))
              }
              else {
                console.log("resp:", resp)
                reject(new Error(resp));
              }
            })
        }),
        {
          loading: "Processing...",
          success: (message) => message,
          error: (error) => error.message,
        }
      );

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


    <>
      <Toaster />

      <div className={styles.div}>
        <div className={styles.div2}>
          <div className={styles.column}>
            <div className={styles.div3}>
              <div className={styles.div4}>WELCOME BACK!</div>
              <div className={styles.div5}>
                {/* <span style="font-family: Nunito, sans-serif;font-weight: 400;color: rgba(68,75,89,1);"> */}
                <span style={{ fontWeight: 400 }}>
                  Don’t have a account,{" "}
                </span>
                {/* <span style="font-family: Nunito, sans-serif;font-weight: 700;color: rgba(134,153,218,1);"> */}
                <span style={{ fontWeight: 700 }}>

                  <Link href="/signup">
                    Sign up
                  </Link>
                </span>
              </div>
              <div className={styles.div6}>Username</div>
              <input className={styles.div7} value={username}
                onChange={e => setUsername(e.target.value)} />
              <div className={styles.div8}>Password</div>
              <input className={styles.div9} type='password' value={password}
                onChange={e => setPassword(e.target.value)} />

              <div className={styles.div10}>
                {/* <div className={styles.div11}>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/b4d20115-4868-4942-8cf0-45ffa39454e5?apiKey=169beee3f9a4440abbde404efbae6ea9&"
                    className="img-3"
                  />
                  <div className={styles.div12}>Remember me</div>
                </div> */}
                <div className={styles.div13}>Forget password?</div>
              </div>
              <div className={styles.div14} onClick={() => handleSignIn()}>Sign In</div>
              <div className={styles.div15}>or continue with</div>
              <div className={styles.div16}>
                <div className={styles.div17} onClick={() => handleSignInGoogle()}>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/20c6afde-fdd2-4e57-8fa6-84b8e4a20add?apiKey=169beee3f9a4440abbde404efbae6ea9&"
                    className="img-4"
                  />
                </div>
                {/* <div className={styles.div18}>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/f224ea88-a67a-4b74-9b27-c5649fbd2eda?apiKey=169beee3f9a4440abbde404efbae6ea9&"
                    className="img-5"
                  />
                </div>
                <div className={styles.div19}>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/c2d4eba2-539e-4ff1-aebb-399bd2f31479?apiKey=169beee3f9a4440abbde404efbae6ea9&"
                    className="img-6"
                  />
                </div> */}
              </div>
            </div>
          </div>
          <div className={styles.column2}>
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&"
              className="img-7"
            />
          </div>
        </div>
      </div >

    </>
  );
}


export default Login
