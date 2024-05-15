import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Divider, User, Avatar } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useRouter } from 'next/navigation';

const FollowerModal = (props) => {
  const router = useRouter()
  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Người theo dõi</ModalHeader>
            <Divider />
            <ModalBody>
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faSearch} color="gray" className='mr-2' />
                <input placeholder='Search' type="" name="" value="" className='w-full' />
              </div>
              <div className='max-h-44 flex flex-col overflow-y-scroll'>
                {
                  props.followers.length !== 0 ?
                    props.followers.map(user => (
                      <div className='flex my-2 mr-2 items-center cursor-pointer' onClick={() => router.replace(`/user/${user._id}/profile`)}>
                        <Avatar name={user.displayName} src={
                          user.avatar.includes("googleusercontent") ?
                            user.avatar
                            : `${types.BACKEND_URL}/api/accountimg/${user.avatar}`} />
                        <span className='mx-2'>{user.displayName}</span>
                      </div>
                    ))
                    :
                    <>Người dùng này chưa có người theo dõi.</>
                }
              </div>
            </ModalBody>

          </>
        )}
      </ModalContent>
    </Modal >
  )
}

export default FollowerModal
