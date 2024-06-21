"use client";
import React, { useEffect } from "react";
import styles from "../profile.module.scss";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faRemove, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { redirect } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBookFromLibrary,
  getBooksFromMyLibrary,
} from "@/app/redux/actions/myLibrary";
import Loading from "@/components/Loading/Loading";
import ToastContainerWrapper from "@/components/ToastContainerWrapper/ToastContainerWrapper";
import {
  TableCell,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  Button,
  useDisclosure,
  Progress,
} from "@nextui-org/react";
import { getMembershipById } from "@/app/redux/actions/membership";
import { getReadHistory } from "@/app/redux/actions/book";
import * as types from "@/app/redux/types";
import { getPostByUserIdRequest } from "@/app/redux/saga/requests/post";
import { getUserTransactionsRequest } from "@/app/redux/saga/requests/transaction";
import FollowerModal from "@/components/Modals/FollowerModal/FollowerModal";
import FollowingModal from "@/components/Modals/FollowingModal/FollowingModal";
import { getAllFollowers, getAllFollowings, isFollowingRequest } from "@/app/redux/saga/requests/follow";
import { getAccountByIdRequest } from "@/app/redux/saga/requests/account";
import CreateReadingGoalModal from "@/components/Modals/CreateReadingGoalModal/CreateReadingGoalModal";
import { createReadingGoalRequest, deleteReadingGoalByIdRequest, editReadingGoalRequest, getReadingGoalsByUserId, resetReadingProgressRequest } from "@/app/redux/saga/requests/readingGoal";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import EditReadingGoalModal from "@/components/Modals/EditReadingGoalModal/CreateReadingGoalModal";
import DeleteReadingGoalConfirmModal from "@/components/Modals/DeleteReadingGoalConfirmModal/DeleteReadingGoalConfirmModal";

const Profile = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.slug;
  const [currentTopic, setCurrentTopic] = useState(id);
  const booksLibrary = useSelector((state) => state.myLibrary.bookList);
  const bookLoading = useSelector((state) => state.books.loading);
  const readHistories = useSelector((state) => state.books.readHistory);
  const isLoading = useSelector((state) => state.myLibrary.loading);
  const [currentAccount, setCurrentAccount] = useState(null)
  const deleteBookResult = useSelector((state) => state.myLibrary.message);
  const membership = useSelector((state) => state.memberships.membership);
  const isLoadingMembership = useSelector((state) => state.memberships.loading);
  const [postList, setPostList] = useState([]);
  const [isLoadingPostList, setIsLoadingPostList] = useState(false);
  const [isLoadingUserTrans, setIsLoadingUserTrans] = useState(false);
  const [click, setClick] = useState(0);
  const [userTrans, setUserTrans] = useState();
  const dispatch = useDispatch();
  const { isOpen: isOpenFollower, onOpen: onOpenFollower, onOpenChange: onOpenChangeFollower } = useDisclosure();
  const { isOpen: isOpenFollowing, onOpen: onOpenFollowing, onOpenChange: onOpenChangeFollowing } = useDisclosure();
  const [followers, setFollowers] = useState([])
  const [followings, setFollowings] = useState([])
  const { isOpen: isOpenCreateReadingGoal, onOpen: onOpenCreateReadingGoal,
    onOpenChange: onOpenChangeCreateReadingGoal, onClose: onCloseCreateReadingGoal } = useDisclosure();
  const { isOpen: isOpenEditReadingGoal, onOpen: onOpenEditReadingGoal,
    onOpenChange: onOpenChangeEditReadingGoal, onClose: onCloseEditReadingGoal } = useDisclosure();
  const { isOpen: isOpenDeleteReadingGoalConfirm, onOpen: onOpenDeleteReadingGoalConfirm,
    onOpenChange: onOpenChangeDeleteReadingGoalConfirm, onClose: onCloseDeleteReadingGoalConfirm } = useDisclosure();
  const [readingGoals, setReadingGoals] = useState(null)
  const [isLoadingReadingGoal, setIsLoadingReadingGoal] = useState(false)
  const [currentEditReadingGoal, setCurrentEditReadingGoal] = useState(null)
  const [currentDeletingReadingGoal, setCurrentDeletingReadingGoal] = useState(null)

  function getBookType(book) {
    if (book.access_level == 2) {
      return "book";
    }
    return book.chapters && book.chapters.length > 0 ? "audio-book" : "ebook";
  }

  const handleDeleteBook = (choosenBook) => {
    var request = {
      user: currentAccount._id,
      book: choosenBook,
    };
    dispatch(deleteBookFromLibrary(request));
    if (deleteBookResult === 0) {
      toast("Xoá sách khỏi thư viện thành công!", {
        autoClose: 2000,
        type: "success",
      });
    }
    if (deleteBookResult === 1) {
      toast("Xóa thất bại!", {
        autoClose: 2000,
        type: "error",
      });
    }
    setClick((p) => p + 1);
  };



  const getPostData = () => {
    setIsLoadingPostList(true);
    getPostByUserIdRequest(currentAccount._id).then((resp) => {
      setPostList(resp.data);
    });
    setIsLoadingPostList(false);
  };

  const getUserTransactions = () => {
    setIsLoadingUserTrans(true);
    getUserTransactionsRequest(currentAccount._id, "Book").then((resp) => {
      setUserTrans(resp.transactions);
    });
    setIsLoadingUserTrans(false);
  };

  const getFollowersData = () => {
    getAllFollowers(currentAccount._id).then((resp) => {
      setFollowers(resp.data)
    })
  }
  const getFollowingsData = () => {
    getAllFollowings(currentAccount._id).then((resp) => {
      setFollowings(resp.data)
    })
  }

  const createReadingGoal = (request) => {

    toast.promise(
      new Promise((resolve, reject) => {
        createReadingGoalRequest(request)
          .then((resp) => {
            if (resp.message) {
              resolve(resp.message);
              getReadingGoalData(currentAccount._id)
            } else {
              reject(resp.error);
            }
          })
          .catch((err) => {

          });
      }),
      {
        loading: "Processing...",
        success: (message) => message,
        error: (error) => error,
      }
    );
    onCloseCreateReadingGoal()
  }

  const getReadingGoalData = (userId) => {
    setIsLoadingReadingGoal(true)
    getReadingGoalsByUserId(userId).then(resp => {
      setReadingGoals(resp)
    })
    setIsLoadingReadingGoal(false)
  }

  const editReadingGoal = (request) => {
    toast.promise(
      new Promise((resolve, reject) => {
        editReadingGoalRequest(currentEditReadingGoal._id, request)
          .then((resp) => {
            if (resp.message) {
              resolve(resp.message);
              getReadingGoalData(currentAccount._id)
            } else {
              reject(resp.error);
            }
          })
          .catch((err) => {

          });
      }),
      {
        loading: "Processing...",
        success: (message) => message,
        error: (error) => error,
      }
    );
    onCloseEditReadingGoal()

  }
  const deleteReadingGoal = () => {

    toast.promise(
      new Promise((resolve, reject) => {
        deleteReadingGoalByIdRequest(currentDeletingReadingGoal._id)
          .then((resp) => {
            if (resp.message) {
              resolve(resp.message);
              getReadingGoalData(currentAccount._id)
            } else {
              reject(resp.error);
            }
          })
          .catch((err) => {

          });
      }),
      {
        loading: "Processing...",
        success: (message) => message,
        error: (error) => error,
      }
    );
    onCloseDeleteReadingGoalConfirm()
  }

  const getPercentBooksRead = (booksRead, totalBookGoal) => {
    return (booksRead * 100) / totalBookGoal
  }
  useEffect(() => {
    if (JSON.parse(localStorage.getItem('user'))) {
      if (currentAccount) {

        dispatch(getMembershipById(currentAccount._id));
        dispatch(getReadHistory(currentAccount._id));
        getUserTransactions();
        dispatch(getBooksFromMyLibrary(currentAccount._id));
        getPostData();
        getFollowersData();
        getFollowingsData();
        getReadingGoalData(currentAccount._id)
      }
    }
    else {
      router.push("/login");
    }
  }, [currentAccount])

  useEffect(() => {
    setCurrentAccount(JSON.parse(localStorage.getItem('user')))
  }, []);


  return (
    <div className={styles.profileContainer}>
      <Header />
      <Toaster />
      <div className={styles.profileContent}>
        <section className={styles.accountContainer}>
          <div className={styles.accountBody}>
            <div className={styles.accountAvatar}>
              {currentAccount?.avatar ? (
                <img
                  src={
                    currentAccount.avatar.includes("googleusercontent") ?
                      currentAccount.avatar
                      : `${types.BACKEND_URL}/api/accountimg/${currentAccount.avatar}`}
                  alt="avt"
                />
              ) : (
                <img
                  src="https://docsachhay.net/frontend/images/default-avatar.jpg"
                  alt="avt"
                />
              )}
            </div>
            <div className={styles.accountPanel}>
              <div className={styles.accountInfo}>
                <div className={styles.top}>
                  <div className={styles.title}>{currentAccount?.displayName}</div>

                </div>

                <div className={styles.followInfo}>
                  <div className={styles.followItem} onClick={() => onOpenFollower()}>
                    <span>245 </span>
                    Người theo dõi
                  </div>
                  <div className={styles.followItem} onClick={() => onOpenFollowing()}>
                    <span>245 </span>
                    Đang theo dõi
                  </div>
                  <div className={styles.followItem}>
                    <span>245 </span>
                    Bài viết
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.ruler}></div>
          <div className={styles.accountNav}>
            <div
              className={`${styles.navItem} ${currentTopic === "profile" ? styles.active : ""
                }`}
            >
              <Link href="/account/profile">Thông tin cá nhân</Link>
            </div>
            <div
              className={`${styles.navItem} ${currentTopic === "library" ? styles.active : ""
                }`}
            >
              <Link href="/account/library">Thư viện của tôi</Link>
            </div>
            <div
              className={`${styles.navItem} ${currentTopic === "history" ? styles.active : ""
                }`}
            >
              <Link href="/account/history">Lịch sử đọc </Link>
            </div>
            <div
              className={`${styles.navItem} ${currentTopic === "membership" ? styles.active : ""
                }`}
            >
              <Link href="/account/membership">Thông tin hội viên</Link>
            </div>
            <div
              className={`${styles.navItem} ${currentTopic === "my-post" ? styles.active : ""
                }`}
            >
              <Link href="/account/my-post">Bài viết của tôi</Link>
            </div>
            <div className={styles.navItem}>
              <Link href="/account/my-book">Sách đã mua</Link>
            </div>
            <div className={styles.navItem}>
              <Link href="/account/reading-goal">Mục tiêu đọc sách</Link>
            </div>
          </div>
        </section>
        {/* profile section */}
        {currentTopic == "profile" ? (
          <section className={styles.profileInfo}>
            <div className={styles.uHead}>
              <div className={styles.title}>Thông tin cá nhân</div>
            </div>
            <div className={styles.uTable}>
              <Table hideHeader aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn></TableColumn>
                  <TableColumn></TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key="1">
                    <TableCell>Họ tên</TableCell>
                    <TableCell>{currentAccount?.displayName}</TableCell>
                  </TableRow>
                  <TableRow key="2">
                    <TableCell>Email</TableCell>
                    <TableCell>{currentAccount?.email}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            {/* <Toaster/> */}
            {currentAccount?.username && (
              <Link href="/change-password" prefetch={false} >
                <button className={styles.changePasswordButton}>
                  Thay đổi mật khẩu
                </button>
              </Link>
            )}
            {/* <Toaster/> */}
          </section>
        ) : (
          <></>
        )}
        {/* library section */}
        {currentTopic == "library" ? (
          <section className={styles.profileInfo}>
            <div className={styles.libraryHead}>
              <div className={styles.title}>Tiêu đề sách, truyện</div>
              {/* <div className="flex flex-wrap gap-4">
              <Tabs variant="solid" color="primary" aria-label="Tabs variants">
                <Tab key="sachdangdoc" title="Sách đang đọc" />
                <Tab key="sachyeuthich" title="Sách yêu thích" />
              </Tabs>
            </div> */}
            </div>
            <div className={styles.libraryBody}>
              <table class="table-auto w-full">
                <thead class="bg-slate-300">
                  <tr>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Book
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Name
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Author
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <Loading />
                  ) : (
                    booksLibrary.map((book) => (
                      <tr>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          <img
                            src={`${types.BACKEND_URL}/api/bookimg/${book.book.image}`}
                            alt="image"
                            className={styles.bookLibImg}
                          />
                        </td>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-200">
                          <Link
                            href={`/${getBookType(book.book)}/${book.book._id}`}
                            prefetch={false}
                            shallow
                          >
                            {book.book.name}
                          </Link>
                        </td>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          {book.book.author}
                        </td>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            class="cursor-pointer"
                            width={20}
                            onClick={() => handleDeleteBook(book.book)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <></>
        )}
        {/* history section */}
        {currentTopic == "history" ? (
          <section className={styles.profileInfo}>
            <div className={styles.historyHead}>
              <div className={styles.title}>
                Danh sách sách, truyện bạn đã đọc{" "}
              </div>
            </div>

            <div className={styles.libraryBody}>
              <table class="table-auto w-full">
                <thead class="bg-slate-300">
                  <tr>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Book
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Name
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Author
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!readHistories ? (
                    <Loading />
                  ) : (
                    readHistories.map((readHistory, index) => (
                      <tr key={index}>
                        <td className="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          {readHistory.book && readHistory.book.image ? (
                            <img
                              src={`${types.BACKEND_URL}/api/bookimg/${readHistory.book.image}`}
                              alt="image"
                              className={styles.bookLibImg}
                            />
                          ) : (
                            <img
                              src="default-image-path" // Đường dẫn tới hình ảnh mặc định
                              alt="default image"
                              className={styles.bookLibImg}
                            />
                          )}
                        </td>
                        <td className="border-b text-center border-gray-400 px-4 py-2 max-w-200">
                          {readHistory.book ? (
                            <Link
                              href={`/${getBookType(readHistory.book)}/${readHistory.book._id}`}
                              prefetch={false}
                              shallow
                            >
                              {readHistory.book.name}
                            </Link>
                          ) : (
                            <span>No book names available</span>
                          )}
                        </td>
                        <td className="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          {readHistory.book ? readHistory.book.author : "No author available"}
                        </td>
                        <td className="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          {readHistory.time}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <></>
        )}
        {/* membership section */}
        {currentTopic == "membership" ? (
          <section className={styles.profileInfo}>
            <div className={styles.uHead}>
              <div className={styles.title}>Thông tin hội viên</div>
            </div>
            {!membership ? (
              <>Người dùng chưa đăng kí gói hội viên!</>
            ) : (
              <div className={styles.uTable}>
                {isLoadingMembership ? (
                  <Loading />
                ) : (
                  <Table
                    hideHeader
                    aria-label="Example static collection table"
                  >
                    <TableHeader>
                      <TableColumn></TableColumn>
                      <TableColumn></TableColumn>
                    </TableHeader>

                    <TableBody>
                      <TableRow key="1">
                        <TableCell>Họ tên</TableCell>
                        <TableCell>{currentAccount?.displayName}</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Gói hội viên</TableCell>
                        <TableCell>
                          {membership.type === "1month" ? "Gói 1 tháng" : ""}
                          {membership.type === "year" ? "Gói năm" : ""}
                          {membership.type === "3month" ? "Gói 3 tháng" : ""}
                        </TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Ngày đăng kí</TableCell>
                        <TableCell>{membership.start_date}</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Ngày hết hạn</TableCell>
                        <TableCell>{membership.outdated_on}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </div>
            )}
          </section>
        ) : (
          <></>
        )}
        {currentTopic == "my-post" ? (
          <section className={styles.myPostInfo}>
            <div className={styles.uHead}>
              <div className={styles.title}>Bài viết của tôi</div>
            </div>
            <div className={styles.uTable}>
              <div className={styles.myPostList}>
                {isLoadingPostList ? (
                  <isLoading />
                ) : (
                  <>
                    {postList.length === 0 ? (
                      <div>Chưa có bài viết.</div>
                    ) : (
                      postList.map((post) => (
                        <Link href={`/post/${post._id}`} prefetch={false} >
                          <div className={styles.postItem}>
                            <img
                              className={styles.imgPost}
                              src={
                                post?.image
                                  ? `${types.BACKEND_URL}/api/postimg/${post?.image}`
                                  : tempImg
                              }
                              alt="main post img"
                            />
                            <div className={styles.postTitle}>{post.title}</div>
                          </div>
                        </Link>
                      ))
                    )}
                  </>
                )}
                {/* <div className={styles.postItem}>
                  <Image src={bookImg} alt="post img" />
                  <div className={styles.postTitle}>title</div>
                </div>
                <div className={styles.postItem}>
                  <Image src={bookImg} alt="post img" />
                  <div className={styles.postTitle}>title</div>
                </div> */}
              </div>
            </div>
          </section>
        ) : (
          <></>
        )}
        {currentTopic == "my-book" ? (
          <section className={styles.profileInfo}>
            <div className={styles.historyHead}>
              <div className={styles.title}>
                Danh sách sách, truyện bạn đã mua{" "}
              </div>
            </div>

            <div className={styles.libraryBody}>
              <table class="table-auto w-full">
                <thead class="bg-slate-300">
                  <tr>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Hình
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Sách
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Tác giả
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Thể loại
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!userTrans ? (
                    <Loading />
                  ) : (
                    userTrans.map((trans) => (
                      <tr>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          <img
                            src={`${types.BACKEND_URL}/api/bookimg/${trans.product.image}`}
                            alt="image"
                            className={styles.bookLibImg}
                          />
                        </td>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-200">
                          <Link
                            href={`/${getBookType(trans.product)}/${trans.product._id}`}
                            prefetch={false}
                            shallow
                          >
                            {trans.product.name}
                          </Link>
                        </td>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          {trans.product.author}
                        </td>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          {trans.product.tags.map((tag, index) => (
                            <React.Fragment key={index}>{tag}</React.Fragment>
                          ))}
                        </td>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          <div className={styles.readBtn}>
                            <Link
                              href={`/reader/${trans.product._id}`}
                              prefetch={false}
                            >
                              Đọc sách
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <></>
        )}
        {/* profile section */}
        {currentTopic == "reading-goal" ? (
          <section className={styles.readingGoalContainer}>
            <div className={styles.uHead}>
              <div className={styles.title}>Mục tiêu đọc sách</div>
            </div>
            <div>
              <div className={styles.readingGoalBody}>
                <div className={styles.readingGoalContent}>
                  <div className={styles.title}>
                    Thống kê kết quả đọc sách
                    <Button color="primary" onClick={() => onOpenCreateReadingGoal()}>Thiết lập mục tiêu đọc sách</Button>
                  </div>
                  {
                    !isLoadingReadingGoal && readingGoals ?
                      <>
                        {
                          readingGoals.length !== 0 ?
                            <>
                              {
                                readingGoals.map(goal => (
                                  <div className={styles.goalItem}>
                                    <div className={styles.goalContent}>
                                      <label>Mục tiêu trong
                                        {goal.timeFrame == "day" ? " ngày"
                                          : goal.timeFrame == "week" ? " tuần"
                                            : goal.timeFrame == "month" ? " tháng"
                                              : " năm"}: đã đọc được {goal.goalType == "pages" ? goal.pagesRead : goal.booksRead.length}/{goal.goalAmount} {goal.goalType == "pages" ? "trang" : "quyển"} sách</label>

                                      <div className={styles.goalActionList}>
                                        <div className={styles.actionItem}
                                          onClick={() => {
                                            setCurrentEditReadingGoal(goal)
                                            onOpenEditReadingGoal()
                                          }}>
                                          <FontAwesomeIcon
                                            icon={faPencil}
                                            class="cursor-pointer"
                                            width={15}
                                          />
                                        </div>
                                        <div className={styles.actionItem}
                                          onClick={() => {
                                            setCurrentDeletingReadingGoal(goal)
                                            onOpenDeleteReadingGoalConfirm()
                                          }}>
                                          <FontAwesomeIcon
                                            icon={faRemove}
                                            class="cursor-pointer"
                                            width={15}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <Progress color={
                                      goal.timeFrame == "day" ? "primary"
                                        : goal.timeFrame == "week" ? "secondary"
                                          : goal.timeFrame == "month" ? "success"
                                            : "danger"
                                    } aria-label="Loading..." value={
                                      goal.goalType == "pages" ? getPercentBooksRead(goal.pagesRead, goal.goalAmount)
                                        : getPercentBooksRead(goal.booksRead.length, goal.goalAmount)
                                    } />
                                  </div>
                                ))
                              }

                            </> :
                            <>Bạn chưa có mục tiêu đọc nào. Hãy tạo một mục tiêu đọc sách cho mình nhé!</>
                        }
                      </> :
                      <Loading />
                  }
                </div>
              </div>
            </div>
          </section>
        ) : (
          <></>
        )}
      </div>
      <Footer />
      <ToastContainerWrapper />
      <FollowerModal isOpen={isOpenFollower} onOpenChange={onOpenChangeFollower} followers={followers} />
      <FollowingModal isOpen={isOpenFollowing} onOpenChange={onOpenChangeFollowing} followings={followings} />
      <CreateReadingGoalModal isOpen={isOpenCreateReadingGoal} onOpenChange={onOpenChangeCreateReadingGoal}
        createReadingGoal={createReadingGoal} user={currentAccount?._id} />
      <EditReadingGoalModal isOpen={isOpenEditReadingGoal} onOpenChange={onOpenChangeEditReadingGoal}
        editReadingGoal={editReadingGoal} user={currentAccount?._id} goal={currentEditReadingGoal} />
      <DeleteReadingGoalConfirmModal
        isOpen={isOpenDeleteReadingGoalConfirm}
        onOpenChange={onOpenChangeDeleteReadingGoalConfirm}
        deleteReadingGoal={deleteReadingGoal} />
    </div>
  );
};

export default Profile;
