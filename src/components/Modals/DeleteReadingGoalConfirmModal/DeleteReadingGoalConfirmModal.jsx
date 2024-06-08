import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Avatar } from "@nextui-org/react";

const DeleteReadingGoalConfirmModal = (props) => {
  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <div className='flex flex-col justify-center items-center'>
                <div className='text-base font-semibold'>Bạn muốn xóa mục tiêu này?</div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Đóng
              </Button>
              <Button color="primary" onClick={props.deleteReadingGoal}>
                Xóa mục tiêu              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default DeleteReadingGoalConfirmModal
