
"use client"
import React, { useState, useEffect, useMemo, useRef } from 'react'
import styles from './NewPost.module.scss'
import HeaderCommunity from '@/components/HeaderCommunity/Header'
import { createNewPostRequest, uploadPostImageRequest } from '../redux/saga/requests/post'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from "react-hot-toast";
import { Chip } from "@nextui-org/react";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem
} from "@nextui-org/react";
import { getAllTagsRequest } from '../redux/saga/requests/tag';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor'


const NewPost = () => {
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState("")
  const router = useRouter()
  const [tags, setTags] = useState([''])
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );
  const [selectedTags, setSelectedTags] = useState([])
  const [postBodyContent, setPostBodyContent] = useState('');
  const [selectedImage, setSelectedImage] = useState("")

  const handleClose = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    if (selectedTags.length === 1) {
      setSelectedTags([]);
    }
  };
  console.log("user", user._id)
  const handleCreatePost = () => {
    if (!user) {
      router.replace('/login')
    }

    let tagRequest = tags.filter(tagItem => {
      if (selectedTags.includes(tagItem.description)) {
        return tagItem._id
      }
    })
    tagRequest = tagRequest.map(item => item._id)

    toast.promise(
      new Promise((resolve, reject) => {
        uploadPostImageRequest(selectedImage).then(respUploadImg => {
          if (respUploadImg.error) {
            reject(respUploadImg.error)
          }
          else {
            const postRequest = {
              account: (user._id.toString()),
              title: title,
              content: postBodyContent,
              tag: tagRequest,
              image: respUploadImg.filename
            }
            console.log("postRequest", postRequest)
            createNewPostRequest(postRequest)
              .then((resp) => {
                if (resp.message) {
                  resolve(resp.message);
                  router.replace("/community")
                } else {
                  console.log("resp.error", resp.error.toString())
                  reject(resp.error);
                }
              })
              .catch((err) => {
                console.log("err", err);
              });
          }
        })
      }),
      {
        loading: "Processing...",
        success: (message) => message,
        error: (error) => error,
      }
    );
  }


  const loadTagData = () => {
    getAllTagsRequest().then(resp => {
      console.log("resp", resp.allTags)
      setTags(resp.allTags)
    })
  }
  useEffect(() => {
    setSelectedTags(Array.from(selectedKeys))
  }, [selectedKeys])
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    setUser(userData)
    if (!userData) {
      router.replace('/login')
    }
    loadTagData()
  }, [])
  return (
    <div className={styles.newPostContainer}>
      <Toaster />
      <HeaderCommunity />
      <div className={styles.newPostContent}>
        <div className={styles.newPostTitle}>
          Tạo bài viết mới
        </div>
        <div className={styles.inputTitle}>
          <span>Hình ảnh bài viết: </span>
          <input type="file" onChange={(e) => setSelectedImage(e.target.files[0])} />
        </div>
        <div className={styles.inputTitle}>
          <span>Tiêu đề bài viết: </span>
          <input type="text" placeholder='Nhập tiêu đề...' onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className={styles.tagInput}>
          <div className={styles.top}>
            <div className={styles.title}>
              Tags:
            </div>
            <div className={styles.btn} onClick={onOpen}>
              Chọn tag
            </div>
          </div>
          <div className={styles.tagList}>
            <div className="flex gap-2">
              {selectedTags.map((tagItem, index) => (
                <Chip key={index} onClose={() => handleClose(tagItem)} variant="flat">
                  {tagItem}
                </Chip>
              ))}
            </div>
          </div>
        </div>
        <RichTextEditor setPostBodyContent={setPostBodyContent} />
        <div className={styles.submitBtn} onClick={handleCreatePost}>
          Gửi
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chọn tag cho bài viết của bạn:</ModalHeader>
              <ModalBody>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      className="capitalize"
                    >
                      {selectedValue}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Multiple selection example"
                    variant="flat"
                    closeOnSelect={false}
                    disallowEmptySelection
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                  >
                    {
                      tags ? tags.map((tagItem) => (
                        <DropdownItem key={tagItem.description}>{tagItem.description}</DropdownItem>
                      ))
                        :
                        <DropdownItem key=""></DropdownItem>

                    }
                  </DropdownMenu>
                </Dropdown>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  OK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  )
}

export default NewPost
