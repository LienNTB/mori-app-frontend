"use client"
import React, { useEffect, useState } from 'react'
import styles from "./change-password.module.scss"
import { useDispatch } from 'react-redux'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { useSearchParams } from 'next/navigation';
import { changePasswordRequest } from '../redux/saga/requests/account'
import { Toaster, toast } from "react-hot-toast";



const ResetPassword = () => {
  const dispatch = useDispatch()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setPassword] = useState("")
  const [retypePassword, setRetypePassword] = useState("")
  const [user, setUser] = useState("")
  const currentAccount = user
  const username = currentAccount.username;
  console.log(username);

  const handleResetPassword = async () => {
    if (currentPassword === "" || newPassword === "" || retypePassword == "") {
      toast.error("Vui lòng nhập đủ thông tin!", {
        duration: 2000, position: 'top-center',
      })
    }
    else if (newPassword !== retypePassword) {
      toast.error("Mật khẩu nhập lại không khớp!", {
        duration: 2000, position: 'top-center',
      })
    }
    else {
      toast.promise(
        new Promise((resolve, reject) => {
          changePasswordRequest(username, currentPassword, newPassword)
            .then((resp) => {
              console.log(resp);
              if (resp.error) {
                reject(resp.message);
              }
              if (resp.message) {
                resolve("Cập nhật mật khẩu thành công!");
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
  }

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")))
  }, [])
  return (
    <>
      <Toaster />
      <div className={styles.div}>
        <div className={styles.div2}>
          <div className={styles.column}>
            <div className={styles.div3}>
              <div className={styles.div4}>Password Change</div>
              <div className={styles.div5}>
              </div>
              <div className={styles.div6}>Current Password</div>
              <input className={styles.div7} type="password" value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)} />
              <div className={styles.div6}>New Password</div>
              <input className={styles.div7} type="password" value={newPassword}
                onChange={e => setPassword(e.target.value)} />
              <div className={styles.div8}>Retype new password</div>
              <input className={styles.div9} type='password' value={retypePassword}
                onChange={e => setRetypePassword(e.target.value)} />
              <div className={styles.div14} onClick={() => handleResetPassword()}>Change password</div>
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
      <Toaster />
    </>
  );
}


export default ResetPassword
