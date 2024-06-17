"use client"
import React, { useState, useEffect, useMemo, useRef } from 'react'
import styles from './NewPost.module.scss'
import HeaderCommunity from '@/components/HeaderCommunity/Header'
import { createNewPostRequest, uploadPostImageRequest } from '../redux/saga/requests/post'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from "react-hot-toast";
import { Chip, Listbox, ListboxItem } from "@nextui-org/react";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem
} from "@nextui-org/react";
import { getAllTagsRequest } from '../redux/saga/requests/tag';
import dynamic from 'next/dynamic';
import { findBookByNameRequest } from '../redux/saga/requests/book'
import Loading from '@/components/Loading/Loading'
import { ListboxWrapper } from '@/components/ListboxWrapper/ListboxWrapper'

const RichTextEditor = dynamic(
  () =>
    import('../../components/RichTextEditor/RichTextEditor').then(
      (mod) => mod.default
    ),
  { ssr: false }
)

const NewPost = () => {
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState("")
  const router = useRouter()
  const [tags, setTags] = useState([''])
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isOpenReviewBook, onOpen: onOpenReviewBook, onOpenChange: onOpenChangeReviewBook,
    onClose: onCloseReviewBook
  } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );
  const [selectedTags, setSelectedTags] = useState([])
  const [postBodyContent, setPostBodyContent] = useState('');
  const [selectedImage, setSelectedImage] = useState("")
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);
  const [isSearchingBooks, setIsSearchingBooks] = useState(false);
  const [isOpenSearchBox, setIsOpenSearchBox] = useState(false)
  const [selectedSearchingBook, setSelectedSearchingBook] = useState(null)
  const [filteredBooks, setFilteredBooks] = useState([]);
  const handleClose = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    if (selectedTags.length === 1) {
      setSelectedTags([]);
    }
  };
  const handleCreatePost = () => {
    if (!user) {
      router.replace('/login', undefined, { shallow: true })
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
              image: respUploadImg.filename,
              book: selectedSearchingBook ? selectedSearchingBook._id : null
            }
            createNewPostRequest(postRequest)
              .then((respCreatePost) => {
                if (respCreatePost.message) {
                  resolve(respCreatePost.message);
                  router.replace("/community", undefined, { shallow: true })
                } else {
                  reject(respCreatePost.error);
                }
              })
              .catch((err) => {
                reject("Tạo bài viết thất bại! Vui lòng thử lại!")
                  ;
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
  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (event.target.value === "") {
      setIsOpenSearchBox(false)
    }
    else {
      setIsOpenSearchBox(true)
    }

  };
  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setFilteredBooks(books); // Reset on outside click
    }
  };

  const loadTagData = () => {
    getAllTagsRequest().then(resp => {
      setTags(resp.allTags)
    })
  }

  useEffect(() => {
    // handle search for book names everytime search value change
    if (searchTerm !== "") {
      setIsSearchingBooks(true)
      findBookByNameRequest(searchTerm).then(resp => {
        setFilteredBooks(resp)
      })
      setIsSearchingBooks(false)
    }
  }, [searchTerm])
  useEffect(() => {
    setSelectedTags(Array.from(selectedKeys))
  }, [selectedKeys])
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    setUser(userData)
    if (!userData) {
      router.replace('/login', undefined, { shallow: true })
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
        <div className={styles.bookInput}>
          <div className={styles.top}>
            <div className={styles.title}>
              Chọn sách cần review: {selectedSearchingBook ? selectedSearchingBook.name : ""}
            </div>
            <div className={styles.btn} onClick={onOpenReviewBook}>
              Chọn sách
            </div>
          </div>

        </div>
        <div className={styles.postTitle}>
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
                    style={{ overflowY: "scroll", maxHeight: "200px" }}
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
      <Modal isOpen={isOpenReviewBook} onOpenChange={onOpenChangeReviewBook}>
        <ModalContent>
          {(onCloseReviewBook) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chọn sách được review:</ModalHeader>
              <ModalBody>
                <div className={styles.searchableDropdown}>
                  <input type="text" list="bookOptions"
                    className={styles.searchBookInput}
                    id="myInput" placeholder="Start typing..." value={searchTerm}
                    onChange={handleSearchChange}
                    ref={inputRef} />
                  {isOpenSearchBox && <div className={styles.searchBookListBox}>
                    <ListboxWrapper >
                      <Listbox
                        aria-label="Actions"
                      >
                        {
                          !isSearchingBooks ? filteredBooks.map(item => (
                            <ListboxItem key={item._id} onClick={() => {
                              setSelectedSearchingBook(item);
                              setSearchTerm(item.name);
                              setIsOpenSearchBox(false)
                            }}>{item.name}</ListboxItem>
                          )) :
                            <ListboxItem><Loading /></ListboxItem>

                        }
                      </Listbox>
                    </ListboxWrapper>
                  </div>}
                </div>

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onCloseReviewBook}>
                  Close
                </Button>
                <Button color="primary" onPress={onCloseReviewBook}>
                  OK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div >
  )
}

export default NewPost

