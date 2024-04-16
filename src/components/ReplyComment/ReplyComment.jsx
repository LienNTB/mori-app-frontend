import React from 'react'
import tempImg from '../../../public/book.png'

const ReplyComment = ({ replyItem }) => {
  console.log("replyItem", replyItem)
  return (
    <div class="flex flex-row mx-auto justify-between mt-4">
      <div class="flex mr-2">
        <div class="items-center justify-center w-10 h-10 mx-auto">
          <img alt="profil"
            src={replyItem.account?.avatar ? replyItem.account.avatar : tempImg}
            class="object-cover w-10 h-10 mx-auto rounded-full" />
        </div>
      </div>
      <div class="flex-1">
        <div class="text-base font-semibold text-gray-600">{replyItem.account.displayName}<span
          class="text-sm font-normal text-gray-500"> - {new Date(replyItem.created_at).toLocaleDateString('en-GB')}</span></div>
        <div class="text-sm text-gray-600">
          {replyItem.content}
        </div>
      </div>
    </div>
  )
}

export default ReplyComment
