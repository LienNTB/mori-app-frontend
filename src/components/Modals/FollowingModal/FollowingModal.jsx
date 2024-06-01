import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Divider, Avatar } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UnfollowConfirmModal from '../UnfollowConfirmModal/UnfollowConfirmModal';
import * as types from '../../../app/redux/types'

const FollowingModal = (props) => {
  const { isOpen: isOpenUnfollowConfirm, onOpen: onOpenUnfollowConfirm, onOpenChange: onOpenChangeUnfollowConfirm } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null)
  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Đang theo dõi</ModalHeader>
            <Divider />
            <ModalBody>
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faSearch} color="gray" className='mr-2' />
                <input placeholder='Search' type="" name="" value="" className='w-full' />
              </div>
              <div className='max-h-44 flex flex-col overflow-y-scroll'>
                {
                  props.followings.length !== 0 ?
                    props.followings.map(user => (
                      <div className='flex justify-between items-center mr-2'>
                        <div className='flex my-2 items-center cursor-pointer' onClick={() => router.replace(`/user/${user._id}/profile`)}>
                          <Avatar name={user.displayName} src={
                            user.avatar.includes("googleusercontent") ?
                              user.avatar
                              : `${types.BACKEND_URL}/api/accountimg/${user.avatar}`} />
                          <span className='mx-2'>{user.displayName}</span>
                        </div>
                        {props.userHaveAccess && <Button size="sm" onPress={() => { setSelectedUser(user); onOpenChangeUnfollowConfirm() }}>
                          Hủy theo dõi
                        </Button>}
                      </div>
                    ))
                    :
                    <>Người dùng này chưa theo dõi ai.</>
                }
              </div>

            </ModalBody>

          </>
        )}
      </ModalContent>
      <UnfollowConfirmModal isOpen={isOpenUnfollowConfirm} onOpenChange={onOpenChangeUnfollowConfirm} user={selectedUser} />
    </Modal>
  )
}

export default FollowingModal
