"use client"
import DocumentEditor from '@/components/DocumentEditor/DocumentEditor'
import React, { useState, useEffect } from 'react'
import styles from './NewPost.module.scss'
import HeaderCommunity from '@/components/HeaderCommunity/Header'
import { createNewPostRequest } from '../redux/saga/requests/post'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from "react-hot-toast";


const NewPost = () => {
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState("")
  const router = useRouter()
  const handleCreatePost = () => {
    if (!user) {
      router.back('/login')
    }
    const postRequest = {
      account: user._id,
      title: "title",
      content: "content"
    }
    toast.promise(
      new Promise((resolve, reject) => {
        createNewPostRequest(postRequest)
          .then((resp) => {
            if (resp.message) {
              resolve(resp.mesage);
              router.replace("/community")
            } else {
              reject(resp.error);
            }
          })
          .catch((err) => {
            console.log("err", err);
          });
      }),
      {
        loading: "Processing...",
        success: (message) => message,
        error: (error) => error.message,
      }
    );


  }
  useEffect(() => {
    setUser(localStorage.getItem('user'))
  }, [])
  return (
    <div className={styles.newPostContainer}>
      <Toaster />
      <HeaderCommunity />
      <div className={styles.newPostContent}>
        <div className={styles.newPostTitle}>
          New Post
        </div>
        <div className={styles.inputTitle}>
          <span>Post title: </span>
          <input type="text" placeholder='Enter title...' />
        </div>
        <DocumentEditor />
        <div className={styles.submitBtn} onClick={handleCreatePost}>
          Submit
        </div>
      </div>
    </div>
  )
}

export default NewPost
