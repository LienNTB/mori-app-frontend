"use client";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./login.module.scss";
import { useDispatch } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import {
  createAccountRequest,
  getCurrentAccountRequest,
  loginAccountRequest,
} from "../redux/saga/requests/account";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { forgetPasswordRequest } from "../redux/saga/requests/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from "axios";

const Login = () => {
  const router = useRouter();
  const [googleUserResponse, setGoogleUserResponse] = useState(null);
  const [googleUser, setGoogleUser] = useState(null)
  const [authenticated, setAuthenticated] = useState(null);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [email, setEmail] = useState("");
  const handleForgetPassword = () => {
    if (email === "") {
      toast.error("Vui lòng nhập email!", {
        duration: 2000,
        position: "top-center",
      });
    } else {
      toast.promise(
        new Promise((resolve, reject) => {
          forgetPasswordRequest(email).then((resp) => {
            if (resp.message) {
              resolve("Password reset email sent!");
            }
            if (resp.error) {
              reject(new Error(resp.error));
            }
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

  const handleSignInGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setGoogleUserResponse(codeResponse);

    }
  });


  const handleSignInKeyPressed = (e) => {
    if (e.key === "Enter") {
      handleSignIn();
    }
  };

  const handleSignIn = () => {
    const loginRequest = {
      googleAccount: googleUser,
      username,
      password
    }
    toast.promise(
      new Promise((resolve, reject) => {
        loginAccountRequest(loginRequest)
          .then(resp => {
            if (resp.error) {
              reject(resp.error)
            }
            else {
              localStorage.setItem("user", JSON.stringify(resp.user))
              localStorage.setItem("token", JSON.stringify(resp.token))
              router.replace('/homepage', undefined, { shallow: true })
              resolve(resp.message)
            }
          })
      }),
      {
        loading: "Processing...",
        success: (message) => message,
        error: (message) => message,
      }
    );
  }

  useEffect(() => {
    // handle login if handle login google
    if (googleUser) {
      handleSignIn()
    }
  }, [googleUser])
  useEffect(
    () => {
      if (googleUserResponse) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleUserResponse.access_token}`, {
            headers: {
              Authorization: `Bearer ${googleUserResponse.access_token}`,
              Accept: 'application/json'
            }
          })
          .then((res) => {
            setGoogleUser(res.data);
            // handleSignIn()
          })
          .catch((err) => toast.error("Đăng nhập Google thất bại! Vui lòng thử lại"));
      }
    },
    [googleUserResponse]
  );

  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error')
    if (success) {
      setMessage('Email verification successful. Please log in.');
    } else if (error) {
      setMessage('Email verification failed. Please try again.');
    }
    console.log("message: ", success);
  }, []);

  return (
    <>
      <Toaster />
      <div className={styles.div}>
        <div className={styles.div2}>
          <div className={styles.column}>
            <div className={styles.div3}>
              <div className={styles.div4}>WELCOME BACK!</div>
              {message ?
                (<div className={styles.div5}>
                  <span style={{ fontWeight: 500 }}>{message}</span>
                </div>)
                : (<div className={styles.div5}>
                  {/* <span style="font-family: Nunito, sans-serif;font-weight: 400;color: rgba(68,75,89,1);"> */}
                  <span style={{ fontWeight: 400 }}>Don’t have a account, </span>
                  {/* <span style="font-family: Nunito, sans-serif;font-weight: 700;color: rgba(134,153,218,1);"> */}
                  <span style={{ fontWeight: 700 }}>
                    <Link href="/signup" prefetch={false} shallow>Sign up</Link>
                  </span>
                </div>)}

              <div className={styles.div6}>Username</div>
              <input
                className={styles.div7}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className={styles.div8}>Password</div>
              <input
                className={styles.div9}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => handleSignInKeyPressed(e)}
              />

              <div className={styles.div10}>
                {/* <div className={styles.div11}>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/b4d20115-4868-4942-8cf0-45ffa39454e5?apiKey=169beee3f9a4440abbde404efbae6ea9&"
                    className="img-3"
                  />
                  <div className={styles.div12}>Remember me</div>
                </div> */}
                <div className={styles.div13} onClick={onOpen}>
                  Forget password?
                </div>
              </div>
              <div className={styles.div14} onClick={() => handleSignIn()}>
                Sign In
              </div>
              <div className={styles.div15}>or continue with</div>
              <div className={styles.div16}>
                <div
                  className={styles.div17}
                  onClick={() => handleSignInGoogle()}
                >
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/20c6afde-fdd2-4e57-8fa6-84b8e4a20add?apiKey=169beee3f9a4440abbde404efbae6ea9&"
                    className="img-4"
                  />
                </div>
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tìm email của bạn
              </ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={handleForgetPassword}
                >
                  Reset password
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Login;
