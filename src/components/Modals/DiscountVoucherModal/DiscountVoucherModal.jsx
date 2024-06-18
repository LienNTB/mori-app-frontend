import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Avatar } from "@nextui-org/react";
import styles from './style.module.scss'
import * as timeUtils from '../../../utils/timeUtils'

const DiscountVoucherModal = (props) => {
  const discountVouchers = props.discountVouchers
  const userVouchers = props.userVouchers

  const matchedUserVouchers = discountVouchers.map(d => {
    const value = userVouchers.find(u => u.voucher._id === d._id)
    if (value) return value
    return null
  })
  console.log('matchedUserVouchers', matchedUserVouchers)
  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <div className='flex flex-col justify-center items-center'>
                <div className='text-base font-semibold'>Khuyến mại</div>
              </div>
              <div className={styles.voucherList}>
                {
                  discountVouchers.map((v, index) => (
                    <div className={styles.voucherItemWrapper}>
                      <div className={styles.voucherItemInfo}>
                        <div className={styles.voucherInfo}>
                          Code:{v.code}
                        </div>
                        <div className={styles.voucherInfo}>
                          Giảm: {v.discount}% cho 1 sách bán lẻ
                        </div>
                        {matchedUserVouchers[index] && <div className={styles.voucherInfo}>
                          HSD: {timeUtils.convertMongoDBTimeToHourMinDate(matchedUserVouchers[index].expiresDate)}
                        </div>}
                      </div>
                      {matchedUserVouchers[index] && <div className={styles.selectBtn}>Áp dụng</div>}
                      {matchedUserVouchers[index] === null && <div className={styles.disableSelectBtn}>Không áp dụng</div>}
                    </div>
                  ))
                }

              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default DiscountVoucherModal
