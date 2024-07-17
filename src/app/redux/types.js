import { encode, decode } from "base64-js";
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL_DEV; //"http://localhost:8080"; 
export const ADMIN_URL_DEV = process.env.NEXT_PUBLIC_ADMIN_URL_DEV;
export const FRONTEND_URL_DEV = process.env.NEXT_PUBLIC_FRONTEND_URL_DEV;
export const ALLOW_ORIGIN_TOKEN = process.env.NEXT_PUBLIC_ALLOW_ORIGIN_TOKEN;
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

const token = Buffer.from(ALLOW_ORIGIN_TOKEN, "base64").toString();
const accessToken = localStorage.getItem('accessToken') || "";

export const requestHeader = {
  "Content-Type": "application/json",
  Origin: FRONTEND_URL_DEV,
  // Authorization: `Bearer ${accessToken}`,
};

export const getRequestHeader = () => {
  const accessToken = localStorage.getItem('accessToken') || "";
  return {
    "Content-Type": "application/json",
    Origin: FRONTEND_URL_DEV,
    Authorization: `Bearer ${accessToken}`,
  };
};

// * AUTH
export const LOGIN_REQUESTED = "LOGIN_REQUESTED";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";

export const REGISTER_REQUESTED = "REGISTER_REQUESTED";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILED = "REGISTER_FAILED";

// *ACCOUNTS
export const GET_CURRENT_ACCOUNT_REQUESTED = "GET_CURRENT_ACCOUNT_REQUESTED";
export const GET_CURRENT_ACCOUNT_SUCCESS = "GET_CURRENT_ACCOUNT_SUCCESS";
export const GET_CURRENT_ACCOUNT_FAILED = "CREATE_ACCOUNT_FAILED";

export const GET_ACCOUNTS_REQUESTED = "GET_ACCOUNTS_REQUESTED";
export const GET_ACCOUNTS_SUCCESS = "GET_ACCOUNTS_SUCCESS";
export const GET_ACCOUNTS_FAILED = "GET_ACCOUNTS_FAILED";

export const CREATE_ACCOUNT_REQUESTED = "CREATE_ACCOUNT_REQUESTED";
export const CREATE_ACCOUNT_SUCCESS = "CREATE_ACCOUNT_SUCCESS";
export const CREATE_ACCOUNT_FAILED = "CREATE_ACCOUNT_FAILED";

// *BOOKS
export const GET_BOOKS_REQUESTED = "GET_BOOKS_REQUESTED";
export const GET_BOOKS_SUCCESS = "GET_BOOKS_SUCCESS";
export const GET_BOOKS_FAILED = "GET_BOOKS_FAILED";

export const GET_READ_HISTORY_REQUESTED = "GET_READ_HISTORY_REQUESTED";
export const GET_READ_HISTORY_SUCCESS = "GET_READ_HISTORY_SUCCESS";
export const GET_READ_HISTORY_FAILED = "GET_READ_HISTORY_FAILED";

export const GET_BOOKS_BY_CATEGORY_REQUESTED =
  "GET_BOOKS_BY_CATEGORY_REQUESTED";
export const GET_BOOKS_BY_CATEGORY_SUCCESS = "GET_BOOKS_BY_CATEGORY_SUCCESS";
export const GET_BOOKS_BY_CATEGORY_FAILED = "GET_BOOKS_BY_CATEGORY_FAILED";

export const GET_BOOK_REQUESTED = "GET_BOOK_REQUESTED";
export const GET_BOOK_SUCCESS = "GET_BOOK_SUCCESS";
export const GET_BOOK_FAILED = "GET_BOOK_FAILED";

export const SEARCH_BOOKS_REQUESTED = "SEARCH_BOOKS_REQUESTED";
export const SEARCH_BOOKS_SUCCESS = "SEARCH_BOOKS_SUCCESS";
export const SEARCH_BOOKS_FAILED = "SEARCH_BOOKS_FAILED";

export const INCREASE_TOTAL_READ_REQUESTED = "INCREASE_TOTAL_READ_REQUESTED";
export const INCREASE_TOTAL_READ_SUCCESS = "INCREASE_TOTAL_READ_SUCCESS";
export const INCREASE_TOTAL_READ_FAIL = "INCREASE_TOTAL_READ_FAIL";

export const INCREASE_TOTAL_SAVED_REQUESTED = "INCREASE_TOTAL_SAVED_REQUESTED";
export const INCREASE_TOTAL_SAVED_SUCCESS = "INCREASE_TOTAL_SAVED_SUCCESS";
export const INCREASE_TOTAL_SAVED_FAIL = "INCREASE_TOTAL_SAVED_FAIL";

// *MEMBERSHIP
export const REGISTER_MEMBERSHIP_REQUESTED = "REGISTER_MEMBERSHIP_REQUESTED";
export const REGISTER_MEMBERSHIP_SUCCESS = "REGISTER_MEMBERSHIP_SUCCESS";
export const REGISTER_MEMBERSHIP_FAILED = "REGISTER_MEMBERSHIP_FAILED";

// * TAGS
export const GET_TAGS_REQUESTED = "GET_TAGS_REQUESTED";
export const GET_TAGS_SUCCESS = "GET_TAGS_SUCCESS";
export const GET_TAGS_FAILED = "GET_TAGS_FAILED";

export const GET_TAG_REQUESTED = "GET_TAG_REQUESTED";
export const GET_TAG_SUCCESS = "GET_TAG_SUCCESS";
export const GET_TAG_FAILED = "GET_TAG_FAILED";

// * MY LIBRARY
export const GET_BOOKS_FROM_LIBRARY_REQUESTED =
  "GET_BOOKS_FROM_LIBRARY_REQUESTED";
export const GET_BOOKS_FROM_LIBRARY_SUCCESS = "GET_BOOKS_FROM_LIBRARY_SUCCESS";
export const GET_BOOKS_FROM_LIBRARY_FAILED = "GET_BOOKS_FROM_LIBRARY_FAILED";

export const ADD_BOOK_TO_LIBRARY_REQUESTED = "ADD_BOOK_TO_LIBRARY_REQUESTED";
export const ADD_BOOK_TO_LIBRARY_SUCCESS = "ADD_BOOK_TO_LIBRARY_SUCCESS";
export const ADD_BOOK_TO_LIBRARY_FAILED = "ADD_BOOK_TO_LIBRARY_FAILED";

export const DELETE_BOOK_FROM_LIBRARY_REQUESTED =
  "DELETE_BOOK_FROM_LIBRARY_REQUESTED";
export const DELETE_BOOK_FROM_LIBRARY_SUCCESS =
  "DELETE_BOOK_FROM_LIBRARY_SUCCESS";
export const DELETE_BOOK_FROM_LIBRARY_FAILED =
  "DELETE_BOOK_FROM_LIBRARY_FAILED";

// * MEMBERSHIP
export const GET_MEMBERSHIP_BY_ID_REQUESTED = "GET_MEMBERSHIP_BY_ID_REQUESTED";
export const GET_MEMBERSHIP_BY_ID_SUCCESS = "GET_MEMBERSHIP_BY_ID_SUCCESS";
export const GET_MEMBERSHIP_BY_ID_FAILED = "GET_MEMBERSHIP_BY_ID_FAILED";

// * REVIEWS
export const GET_REVIEWS_BY_ID_REQUESTED = "GET_REVIEWS_BY_ID_REQUESTED";
export const GET_REVIEWS_BY_ID_SUCCESS = "GET_REVIEWS_BY_ID_SUCCESS";
export const GET_REVIEWS_BY_ID_FAILED = "GET_REVIEWS_BY_ID_FAILED";

// * COMMENTS
export const GET_ALL_COMMENTS_REQUESTED = "GET_ALL_COMMENTS_REQUESTED";
export const GET_ALL_COMMENTS_SUCCESS = "GET_ALL_COMMENTS_SUCCESS";
export const GET_ALL_COMMENTS_FAILED = "GET_ALL_COMMENTS_FAILED";

export const CREATE_NEW_COMMENT_REQUESTED = "CREATE_NEW_COMMENT_REQUESTED";
export const CREATE_NEW_COMMENT_SUCCESS = "CREATE_NEW_COMMENT_SUCCESS";
export const CREATE_NEW_COMMENT_FAILED = "CREATE_NEW_COMMENT_FAILED";

export const SET_COMMENTS = "SET_COMMENTS";
