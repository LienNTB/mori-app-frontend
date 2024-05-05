import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Avatar } from "@nextui-org/react";

const UnfollowConfirmModal = (props) => {
  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <div className='flex flex-col justify-center items-center'>
                <Avatar src={props.user.avatar} className="w-20 h-20 text-large my-3" />
                <div className='text-base font-semibold'>Hủy theo dõi người dùng {props.user.displayName}?</div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Đóng
              </Button>
              <Button color="primary" onClick={props.handleUnfollowUser}>
                Hủy theo dõi
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default UnfollowConfirmModal
