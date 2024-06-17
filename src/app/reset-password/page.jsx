"use client";
import React, { useEffect, useState } from "react";
import styles from "./reset-password.module.scss";
import { useDispatch } from "react-redux";
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
import { useSearchParams } from "next/navigation";
import {
  resetPasswordRequest,
  checkTokenRequest,
} from "../redux/saga/requests/auth";
import { Toaster, toast } from "react-hot-toast";
import { Router, useRouter } from "next/navigation";
import Link from "next/link";

const ResetPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [checkToken, setCheckToken] = useState();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const isStrongPassword = (password) => {
    // Ít nhất 8 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleResetPassword = async () => {
    if (password === "" || retypePassword == "") {
      toast.error("Vui lòng nhập đủ thông tin!", {
        duration: 2000,
        position: "top-center",
      });
    } else if (!isStrongPassword(password)) {
      toast.error(
        "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt!",
        {
          duration: 2000,
          position: "top-center",
        }
      );
    } else if (password !== retypePassword) {
      toast.error("Mật khẩu không khớp!", {
        duration: 2000,
        position: "top-center",
      });
    } else {
      toast.promise(
        new Promise((resolve, reject) => {
          resetPasswordRequest(token, password).then((resp) => {
            if (resp.message) {
              resolve("Reset mật khẩu thành công!");
              router.replace("/", undefined, { shallow: true });
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

  useEffect(() => {
    checkTokenRequest(token).then((resp) => {
      if (resp.message) {
        // resolve("Reset mật khẩu thành công!");
        setCheckToken(1);
      }
      if (resp.error) {
        if (resp.error == "Token expires") {
          // reject(
          //   new Error(
          //     "Thời gian đặt lại mật khẩu đã hết hạn, bạn vui lòng gửi lại yêu cầu đặt mật khẩu"
          //   )
          // );
          setCheckToken(0);
        } else if (resp.error == "Token invalid") {
          // reject(new Error("Mã xác thực không tồn tại"));
          setCheckToken(-1);
        }
      }
    });
  }, []);

  return (
    <>
      <Toaster />

      <div className={styles.div}>
        <div className={styles.div2}>
          <div className={styles.column}>
            <div className={styles.div3}>
              <div className={styles.div4}>Password reset</div>
              {checkToken == 1 && (
                <>
                  <div className={styles.div5}></div>
                  <div className={styles.div6}>Password</div>
                  <input
                    className={styles.div7}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className={styles.div8}>Retype password</div>
                  <input
                    className={styles.div9}
                    type="password"
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                  />
                  <div
                    className={styles.div14}
                    onClick={() => handleResetPassword()}
                  >
                    Reset password
                  </div>
                </>
              )}

              {checkToken == 0 && (
                <>
                  <div></div>
                  <div className={styles.div3}>
                    Thời gian đặt lại mật khẩu đã hết hạn, bạn vui lòng gửi lại
                    yêu cầu đặt mật khẩu tại trang login
                  </div>
                  <div className={styles.div14}>
                    <Link href="/login" prefetch={false} shallow>
                      Login
                    </Link>
                  </div>
                </>
              )}

              {checkToken != 1 && checkToken != 0 && (
                <div className={styles.div3}>
                  Mã xác thực không tồn tại, vui lòng kiểm tra lại tài khoản của
                  bạn
                </div>
              )}
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
      <Toaster />
    </>
  );
};

export default ResetPassword;
