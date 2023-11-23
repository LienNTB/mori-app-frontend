"use client"
import React, { useCallback, useEffect, useState } from 'react'
import styles from "./reset-password.module.scss"
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
import { createAccountRequest, getCurrentAccountRequest, loginAccountRequest } from '../redux/saga/requests/account'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";

const ResetPassword = () => {
  const dispatch = useDispatch()
  const [password, setPassword] = useState("")
  const [retypePassword, setRetypePassword] = useState("")
  const { isOpen, onOpen, onOpenChange } = useDisclosure();


  return (
    <>
      <Toaster />
      <div className={styles.div}>
        <div className={styles.div2}>
          <div className={styles.column}>
            <div className={styles.div3}>
              <div className={styles.div4}>Password reset</div>
              <div className={styles.div5}>
              </div>
              <div className={styles.div6}>Password</div>
              <input className={styles.div7} type="password" value={password}
                onChange={e => setPassword(e.target.value)} />
              <div className={styles.div8}>Retype password</div>
              <input className={styles.div9} type='password' value={retypePassword}
                onChange={e => setRetypePassword(e.target.value)} />
              <div className={styles.div14} onClick={() => handleSignIn()}>Reset password</div>
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Tìm email của bạn</ModalHeader>
              <ModalBody>
                <Input type="email" label="Email" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Reset password
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}


export default ResetPassword
