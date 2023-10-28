"use client"
import Header from '@/components/Header/Header';
import styles from './book.module.scss'
import Footer from '@/components/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeDropper, faHeart, faSave, faStar } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Tag from '@/components/Tag/Tag';
import { getBooks } from '@/app/redux/actions/book';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Loading from '@/components/Loading/Loading';
import BookItem from '@/components/BookItem/BookItem';
function Book() {
  const dispatch = useDispatch()
  const books = useSelector(state => state.books.books)
  const isLoading = useSelector(state => state.books.loading)

  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);

  return (<>
    <div className={styles.bookContainer}>
      <Header />
      <div className={styles.bookContent}>
        <section className={styles.novelHeader}>
          <div className={styles.left}>
            <img class="" src="https://docsachhay.net/images/e-book/dam-bi-ghet.jpg"
              data-src="https://docsachhay.net/images/e-book/dam-bi-ghet.jpg" alt="Dám Bị Ghét" />
          </div>
          <div className={styles.right}>
            <div className={styles.mainHead}>
              <h1 className={styles.novelTitle}>Dám bị ghét</h1>
              <div className={styles.author}>
                <span>Tác giả: </span>
                <a href="https://docsachhay.net/author/koga-fumitake-kishimi-ichiro" title="Koga Fumitake - Kishimi Ichiro" class="property-item">
                  <span>Koga Fumitake - Kishimi Ichiro</span>
                </a>
              </div>
              <div className={styles.rating}>
                <FontAwesomeIcon icon={faStar} width={25} height={25} style={{ color: "#f8d80d", }} />
                <FontAwesomeIcon icon={faStar} width={25} height={25} style={{ color: "#f8d80d", }} />
                <FontAwesomeIcon icon={faStar} width={25} height={25} style={{ color: "#f8d80d", }} />
                <FontAwesomeIcon icon={faStar} width={25} height={25} style={{ color: "#f8d80d", }} />
                <FontAwesomeIcon icon={faStar} width={25} height={25} style={{ color: "#cfcfcf", }} />
              </div>
              <div className={styles.yourRating}>
                Đánh giá: 4.2/5 từ 28 lượt. Đánh giá của bạn?
              </div>
              <div className={styles.headerStats}>
                <div className={styles.statItem}>
                  <small>Lượt đọc</small>
                  <strong>
                    <FontAwesomeIcon className={styles.icon} icon={faEye} width={20} height={20} />120000
                  </strong>
                </div>
                <div className={styles.statItem}>
                  <small>Lượt thích</small>
                  <strong>
                    <FontAwesomeIcon className={styles.icon} icon={faHeart} width={20} height={20} />120000
                  </strong>
                </div>
                <div className={styles.statItem}>
                  <small>Đánh dấu</small>
                  <strong>
                    <FontAwesomeIcon className={styles.icon} icon={faSave} width={20} height={20} />120000
                  </strong>
                </div>
              </div>
              <div className={styles.category}>
                <div className={styles.title}>
                  Thể loại
                </div>
                <Link href={"/book-category/tamlykynang"}>
                  <button className={styles.tag}>Tâm lý - Kỹ năng sống</button>
                </Link>
              </div>
              <div className={styles.nextAction}>
                <Link href={"/book-category/tamlykynang"}>
                  <button className={styles.read}>Đọc ngay</button>
                </Link>
                <Link href={"/book-category/tamlykynang"}>
                  <button className={styles.save}>Đánh dấu</button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.novelContent}>
          <div className={styles.title}>
            <h1>Giới thiệu</h1>
            <div className={styles.line}>

            </div>
          </div>
          <div className={styles.content}>
            Giới thiệu sách Dám thất bại
            “So với những người thất bại,

            những người thành công thật sự

            đã thất bại nhiều lần hơn,

            chỉ đơn giản là vì

            họ đã cố gắng nhiều lần hơn!”

            Dám thất bại là cuốn sách gối đầu giường dành cho tất cả những ai đang trên con đường đi đến thành công. Là người bạn đồng hành khi bạn cảm thấy mình hụt hẫng, thất bại và đơn độc. Đừng sợ hãi khi đối mặt với những thất bại trên đường đời. Hãy chấp nhận nó như một thử thách nhỏ. Chúng ta cứ nghĩ rằng những người thành đạt ngoài kia đã dễ dàng đạt tới đỉnh cao sao? Không phải vậy! Thành công luôn đi cùng với thất bại, thất bại càng nhiều, kinh nghiệm càng nhiều. Càng vấp ngã càng trưởng thành và dễ dàng đạt đến thành công hơn.

            Nếu không dám thất bại, chúng ta sẽ mãi mãi sống trong vòng tròn an toàn của bản thân, không biết được giới hạn khả năng của mình đến đâu. Và sẽ càng thất bại trên con đường đời.
          </div>
          <div className={styles.tagWrapper}>
            <div className={styles.titleWrapper}>
              <h1>Tags</h1>
              <div className={styles.line}>
              </div>
            </div>
            <div className={styles.tagList}>
              <Tag name="Tâm lý" link="tamly" />
              <Tag name="Tâm lý" link="tamly" />
              <Tag name="Tâm lý" link="tamly" />
              <Tag name="Tâm lý" link="tamly" />
              <Tag name="Tâm lý" link="tamly" />
              <Tag name="Tâm lý" link="tamly" />
              <Tag name="Tâm lý" link="tamly" />
              <Tag name="Tâm lý" link="tamly" />
              <Tag name="Tâm lý" link="tamly" />
              <Tag name="Tâm lý" link="tamly" />
              <Tag name="Tâm lý" link="tamly" />
              <Tag name="Tâm lý" link="tamly" />
              <Tag name="Tâm lý" link="tamly" /><Tag name="Tâm lý" link="tamly" />
              <Tag name="Tâm lý" link="tamly" />
              <Tag name="Tâm lý" link="tamly" /><Tag name="Tâm lý" link="tamly" />
            </div>
          </div>

        </section>
        <section className={styles.relatedBooks}>
          <div className={styles.title}>
            <h1>Sách Tâm Lý - Kỹ Năng Sống hay</h1>

          </div>
          <div className={styles.bookList}>
            {isLoading ? <Loading />
              :
              <>
                {
                  books.map(book => {
                    return (
                      <div className={styles.bookItem}>
                        <BookItem book={book} />
                      </div>
                    )
                  })
                }
              </>
            }
          </div>
        </section>
      </div>
      <Footer />
    </div></>);
}

export default Book;