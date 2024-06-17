import * as type from "../types";

export const createNewComment = (userId, postId, content) => ({
  type: type.CREATE_NEW_COMMENT_REQUESTED,
  payload: {
    account: userId,
    post: postId,
    content: content,
  },
});
export const getAllComments = (userId, postId) => {
  return {
    type: type.GET_ALL_COMMENTS_REQUESTED,
    payload: {
      account: userId,
      post: postId,
    },
  };
};
export const setComments = (comments) => {
  return {
    type: type.SET_COMMENTS,
    payload: comments,
  };
};
