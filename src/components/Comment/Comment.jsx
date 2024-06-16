import React, { useEffect, useState } from 'react'
import styles from './Comment.module.scss'
import ReplyComment from '../ReplyComment/ReplyComment'
import { likeCommentRequest, replyCommentRequest } from '@/app/redux/saga/requests/comment'
import { Toaster, toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const Comment = (props) => {
  const dispatch = useDispatch()
  const comments = props.comments
  const [currentAccount, setCurrentAccount] = useState(null)
  const [replyInputValues, setReplyInputValues] = useState([]);
  const [likeCommentValues, setLikeCommentValues] = useState([])
  const handleReplyInputChange = (e, index) => {
    const newValues = [...replyInputValues];
    newValues[index] = e.target.value;
    setReplyInputValues(newValues);
  };
  const handleClearReplyInput = (index) => {
    const newValues = [...replyInputValues];
    newValues[index] = ""
    setReplyInputValues(newValues);
  };
  const handleLikeCommentValueChange = (value, index) => {
    const newValues = [...likeCommentValues];
    if (value < 0) {
      newValues[index] = 0
    }
    else {
      newValues[index] = value;
    }
    setLikeCommentValues(newValues);
  };


  const handleReplyComment = (comment, index) => {
    if (replyInputValues[index] === "") {
      toast.error("Bạn chưa nhập nội dung trả lời bình luận!")
    }
    else {
      const request = {
        content: replyInputValues[index],
        account: currentAccount._id,
        post: props.post,
        parent_comment: comment._id
      }
      replyCommentRequest(request)
        .then(resp => {
          if (resp.message && resp.data) {
            const createdReply = resp.data
            const updatedComments = [...props.comments]
            updatedComments[index].replies.push(createdReply)
            props.onCommentsUpdate(updatedComments)
            toast.success(resp.message)

          }
        })
      handleClearReplyInput(index)
    }
  }
  const handleLikeComment = (commentId, index) => {
    handleLikeCommentValueChange(
      comments[index]?.likes.some((likedAccount) => likedAccount == currentAccount?._id) ?
        (likeCommentValues[index] - 1) : (likeCommentValues[index] + 1)
      , index)

    toast.promise(
      new Promise((resolve, reject) => {
        likeCommentRequest(commentId, currentAccount._id)
          .then((resp) => {
            if (resp.message) {
              resolve(resp.message);
            } else {
              reject(resp.error);
            }
          })
          .catch((err) => {
            reject("Gửi bình luận thất bại! Vui lòng thử lại")
          });
      }),
      {
        loading: "Processing...",
        success: (message) => message,
        error: (error) => error.message,
      })
  }
  useEffect(() => {
    let likeValues = []
    if (comments) {
      comments.map((c, index) => {
        likeValues[index] = c.likes.length ? c.likes.length : 0
      })
    }
    setLikeCommentValues(likeValues)
  }, [comments])
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      setCurrentAccount(user)
    }
  }, [])

  return (
    <section class="m-0 h-auto">
      <Toaster />
      <div class=" bg-white rounded-xl border shadow-xl mx-auto  sm:px-5 hover:border-blue-200 w-full h-auto">
        <form action="#" class="mt-4">
          <label for="comment" class="block">
            <textarea id="comment" commentInput={props.commentInput} onChange={(e) => props.onCommentInputChange(e.target.value)} cols="30" rows="3" placeholder="Type your comment..." class="px-3 py-2 border shadow-sm border-gray-300 rounded-md w-full block placeholder:text-gray-400 placeholder-gray-500
        focus:outline-none focus:ring-1 bg-gray-50 focus:ring-blue-600 focus:border-blue-600 text-sm"></textarea>
          </label>
          <button type="button" onClick={props.handleCreateComment} class="mt-2  inline-flex items-center justify-center text-gray-100 font-medium leading-none
           bg-blue-600 rounded-md py-2 px-3 border border-transparent transform-gpu hover:-translate-y-0.5 
           transition-all ease-in duration-300 hover:text-gray-200 hover:bg-blue-700 text-sm">
            Post comment
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2 rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
        {
          comments.length == 0 ?
            <>Chưa có bình luận.</>
            :
            <div class="my-4 h-auto">
              <small class="text-base font-bold text-gray-700 ml-1">{comments.length} comments</small>
              <div class="flex flex-col mt-4 w-full h-auto">
                {
                  comments.map((commentItem, index) => (
                    <div class="flex flex-row mx-auto justify-between px-1 py-1 w-full h-auto">
                      <div class="flex mr-2">
                        <div class="items-center justify-center w-12 h-12 mx-auto">
                          <img alt="profil"
                            src={commentItem.account.avatar}
                            class="object-cover w-12 h-12 mx-auto rounded-full" />
                        </div>
                      </div>
                      <div class="flex-1 pl-1 w-full">
                        <div class="text-base font-semibold text-gray-600">{commentItem.account.displayName}<span
                          class="text-sm font-normal text-gray-500"> - {new Date(commentItem.created_at).toLocaleDateString('en-GB')}</span>
                        </div>
                        <div class="text-sm text-gray-600 h-auto w-full text-wrap">
                          {commentItem.content}</div>
                        {/* action */}
                        <div class="flex items-center text-sm mt-1 space-x-3">
                          <svg xmlns="http://www.w3.org/2000/svg" class=" cursor-pointer h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                          <span class="font-semibold">{commentItem?.replies?.length} Bình luận</span>
                          <svg xmlns="http://www.w3.org/2000/svg" class={`cursor-pointer h-4 w-4 ${likeCommentValues[index] ? "text-red-600" : ""}  group-hover:text-red-600 mr-1`} viewBox="0 0 20 20" fill="currentColor"
                            onClick={() => handleLikeComment(commentItem._id, index)}>
                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                          </svg>
                          <span class="font-semibold ">{likeCommentValues[index]}</span>


                        </div>
                        {/* child comments */}
                        {
                          commentItem.replies.length !== 0 ?
                            commentItem.replies.map(replyItem => (
                              <ReplyComment replyItem={replyItem} />
                            )) :
                            <></>
                        }
                        {/* child comment input */}

                        {currentAccount && <div class="flex flex-row mx-auto justify-between mt-4">
                          <div class="flex mr-2">
                            <div class="items-center justify-center w-10 h-10 mx-auto">
                              <img alt="profile"
                                src={currentAccount.avatar}
                                class="object-cover w-10 h-10 mx-auto rounded-full" />
                            </div>
                          </div>
                          <div class="flex-1">
                            <div class="text-base font-semibold text-gray-600">{currentAccount.displayName}</div>
                            <div class="flex flex-row items-center justify-between text-sm text-gray-600 rounded-xl w-full border-solid border-2 border-gray-300 focus-within:shadow-none " >
                              <input type="text" placeholder='Bình luận với vai trò người dùng'
                                value={replyInputValues[index]}
                                onChange={(e) => handleReplyInputChange(e, index)}
                                class="w-3/4 border-none p-2 mx-2.5 outline-none focus:shadow-transparent focus:outline:none" className={styles.commentInput} />
                              {/* <div class="bg-gray-600"> */}
                              <div onClick={() => handleReplyComment(commentItem, index)}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer h-4 w-4 ml-2 rotate-90 h-full mr-3" viewBox="0 0 20 20" fill="currentColor">
                                  <path
                                    d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                              </div>
                              {/* </div> */}
                            </div>
                          </div>
                        </div>}
                      </div>
                    </div>
                  ))
                }


              </div>
            </div>

        }
      </div>
    </section>
    // <section class="m-0 h-auto">
    //   <div class=" bg-white rounded-xl border shadow-xl mx-auto  sm:px-5 hover:border-blue-200 w-full h-auto">
    //     <form action="#" class="mt-4">
    //       <label for="comment" class="block">
    //         <textarea id="comment" commentInput={props.commentInput} onChange={(e) => props.onCommentInputChange(e.target.value)} cols="30" rows="3" placeholder="Type your comment..." class="px-3 py-2 border shadow-sm border-gray-300 rounded-md w-full block placeholder:text-gray-400 placeholder-gray-500
    //       focus:outline-none focus:ring-1 bg-gray-50 focus:ring-blue-600 focus:border-blue-600 text-sm"></textarea>
    //       </label>
    //       <button type="button" onClick={props.handleCreateComment} class="mt-2  inline-flex items-center justify-center text-gray-100 font-medium leading-none
    //          bg-blue-600 rounded-md py-2 px-3 border border-transparent transform-gpu hover:-translate-y-0.5 
    //          transition-all ease-in duration-300 hover:text-gray-200 hover:bg-blue-700 text-sm">
    //         Post comment
    //         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2 rotate-90" viewBox="0 0 20 20" fill="currentColor">
    //           <path
    //             d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    //         </svg>
    //       </button>
    //     </form>
    //     <div class="my-4 h-auto">
    //       <small class="text-base font-bold text-gray-700 ml-1">4 comments</small>
    //       <div class="flex flex-col mt-4 w-full h-auto">
    //         <div class="flex flex-row mx-auto justify-between px-1 py-1 w-full h-auto">
    //           <div class="flex mr-2">
    //             <div class="items-center justify-center w-12 h-12 mx-auto">
    //               <img alt="profil"
    //                 src="https://images.unsplash.com/photo-1619380061814-58f03707f082?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fG1hbiUyMGZhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
    //                 class="object-cover w-12 h-12 mx-auto rounded-full" />
    //             </div>
    //           </div>
    //           <div class="flex-1 pl-1 w-full">
    //             <div class="text-base font-semibold text-gray-600">Đức<span
    //               class="text-sm font-normal text-gray-500">- Feb 11, 2022</span>
    //             </div>
    //             <div class="text-sm text-gray-600 h-auto w-full text-wrap">
    //               Post rất hay, hi vọng tác giả có thể viết thêm những bài post tương tự.
    //             </div>
    //             <div class="flex items-center text-sm mt-1 space-x-3">
    //               <a href="#" class="flex items-center text-blue-500 hover:text-blue-600">
    //                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
    //                   <path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
    //                 </svg>
    //                 <span class="font-semibold">2 Bình luận</span>
    //               </a>
    //               <a href="#" class="flex items-center text-red-500 hover:text-red-600 group">
    //                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:text-red-600 mr-1" viewBox="0 0 20 20" fill="currentColor">
    //                   <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
    //                 </svg>
    //                 <span class="font-semibold ">11</span>
    //               </a>
    //               <a href="#" class="flex items-center text-blue-500 hover:text-blue-600">
    //                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
    //                   <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    //                 </svg>
    //                 <span class="font-semibold">Share</span>
    //               </a>
    //             </div>
    //             <div class="flex flex-row mx-auto justify-between mt-4">
    //               <div class="flex mr-2">
    //                 <div class="items-center justify-center w-10 h-10 mx-auto">
    //                   <img alt="profil"
    //                     src="https://images.unsplash.com/photo-1604238473951-bf1492b379f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHdvbWVuJTIwYXNpYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
    //                     class="object-cover w-10 h-10 mx-auto rounded-full" />
    //                 </div>
    //               </div>
    //               <div class="flex-1">
    //                 <div class="text-base font-semibold text-gray-600">Amanda J. Rich <span
    //                   class="text-sm font-normal text-gray-500">- Feb 11, 2022</span></div>
    //                 <div class="text-sm text-gray-600">
    //                   Lorem ipsum dolor sit amet.
    //                 </div>
    //               </div>
    //             </div>
    //             <div class="flex flex-row mx-auto justify-between mt-4">
    //               <div class="flex mr-2">
    //                 <div class="items-center justify-center w-10 h-10 mx-auto">
    //                   <img alt="profil"
    //                     src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwYmxhY2t8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
    //                     class="object-cover w-10 h-10 mx-auto rounded-full" />
    //                 </div>
    //               </div>
    //               <div class="flex-1">
    //                 <div class="text-base font-semibold text-gray-600">Jonathan Paul <span
    //                   class="text-sm font-normal text-gray-500">- Feb 12, 2022</span></div>
    //                 <div class="text-sm text-gray-600">
    //                   Lorem, ipsum dolor.
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //       </div>
    //     </div>
    //   </div>
    // </section>
  )
}

export default Comment
