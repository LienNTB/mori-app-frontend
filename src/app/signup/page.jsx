"use client";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./signup.module.scss";
import { UserAuth } from "@/app/context/AuthContext";
import { redirect } from "next/navigation";
import { useDispatch } from "react-redux";
import { createNewAccount, getCurrentAccount } from "../redux/actions/account";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import { registerAccountRequest } from "../redux/saga/requests/account";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const { user, googleSignIn } = UserAuth();
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignupKeyPressed = (e) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const isStrongPassword = (password) => {
    // Ít nhất 8 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };
  const handleSignup = () => {
    if (
      username == "" ||
      password == "" ||
      retypePassword == "" ||
      displayName == ""
    ) {
      toast.error("Vui lòng nhập đủ thông tin!", {
        duration: 2000,
        position: "top-center",
      });
    } else if (!isValidEmail(email)) {
      toast.error("Vui lòng nhập một địa chỉ email hợp lệ!", {
        duration: 2000,
        position: "top-center",
      });
      return;
    } else if (!isStrongPassword(password)) {
      toast.error(
        "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt!",
        {
          duration: 2000,
          position: "top-center",
        }
      );
      return;
    } else if (password !== retypePassword) {
      toast.error("Mật khẩu không khớp!", {
        duration: 2000,
        position: "top-center",
      });
    } else {
      const account = {
        username: username,
        email: email,
        displayName: displayName,
        password: password,
      };
      toast.promise(
        new Promise((resolve, reject) => {
          registerAccountRequest(account)
            .then((resp) => {
              if (resp.username) {
                resolve("Đăng kí tài khoản thành công!");
                console.log("resp:", resp);
              } else {
                reject(new Error(resp.message));
                console.log("resp:", resp);
              }
            })
            .catch((err) => {
              reject(new Error(err));
            });
        }),
        {
          loading: "Processing...",
          success: (message) => message,
          error: (error) => error.message,
        }
      );
    }
  };

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
      setAuthenticated(localStorage.getItem("authenticated"));
    }
  }, [user]);

  useEffect(() => {
    if (authenticated) {
      redirect("/");
    }
  }, [authenticated]);

  return (
    <>
      <Toaster />
      <div className={styles.div}>
        <div className={styles.div2}>
          <div className={styles.column}>
            <div className={styles.div3}>
              <div className={styles.div4}>WELCOME BACK!</div>
              <div className={styles.div5}>
                <span style={{ fontWeight: 400 }}>Have an account? </span>
                <Link href="/login">
                  <span style={{ fontWeight: 700 }}>Sign in</span>
                </Link>
              </div>
              <div className={styles.div6}>Email</div>
              <input
                className={styles.div7}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className={styles.div6}>Username</div>
              <input
                className={styles.div7}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className={styles.div6}>Display Name</div>
              <input
                className={styles.div7}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <div className={styles.div8}>Password</div>
              <input
                type="password"
                className={styles.div9}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => handleSignupKeyPressed(e)}
              />
              <div className={styles.div8}>Retype password</div>
              <input
                type="password"
                className={styles.div9}
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
              />

              {/* <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b796b018-1d7a-4402-a600-66ab22f052d5?apiKey=169beee3f9a4440abbde404efbae6ea9&"
                  className="img"
                />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/abe45051-4996-4750-9a67-7fe6f0801290?apiKey=169beee3f9a4440abbde404efbae6ea9&"
                  className="img-2"
                /> */}

              <div className={styles.div14} onClick={() => handleSignup()}>
                Sign Up
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
      </div>
    </>
  );
};

export default SignUp;
