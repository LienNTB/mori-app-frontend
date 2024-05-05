import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Divider, User } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const FollowerModal = (props) => {
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
                <div className='flex justify-between my-2 mr-2 items-center'>
                  <User
                    name="Jane Doe"
                    description="Product Designer"
                    avatarProps={{
                      src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                    }}
                  />
                </div>

              </div>
            </ModalBody>

          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default FollowerModal
