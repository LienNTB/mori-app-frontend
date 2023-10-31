import React from 'react'
import styles from './member-package.module.scss'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

const MemberPackage = () => {
  return (
    <div className={styles.memberPackContainer}>
      <Header />
      <div className={styles.memberPackContent}>
        <div className={styles.banner}>
          <div className={styles.container}>
            <div className={styles.bannerContent}>
              <div className={styles.left}>
                <div className={styles.title}>
                  Website đọc sách online
                </div>
                <div className={styles.subTitle}>
                  #1 Việt Nam về sách đọc, sách nói
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.banner1}>
                  <img src="https://moristorage123.blob.core.windows.net/bookimg/banner1.webp" alt="banner1" />
                </div>
                <div className={styles.banner2}>
                  <img src="https://moristorage123.blob.core.windows.net/bookimg/banner2.webp" alt="banner2" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.packageList}>
          <div className={styles.packageItem}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>
                Gói năm
              </div>
              <div className={styles.bestPrice}>
                Giá tốt nhất
              </div>
            </div>
            <div className={styles.mainPrice}>
              899.000 ₫/Năm
            </div>
            <div className={styles.eachMonth}>
              (Chỉ còn 75.000 ₫ mỗi tháng)
            </div>
            <div className={styles.registerBtn}>
              Mua gói năm
            </div>
          </div>

          <div className={styles.packageItem}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>
                Gói 3 tháng
              </div>
            </div>
            <div className={styles.mainPrice}>
              249.000 ₫/3 tháng
            </div>
            <div className={styles.eachMonth}>
              (Chỉ còn 83.000 ₫ mỗi tháng)
            </div>
            <div className={styles.registerBtn}>
              Mua gói 3 tháng
            </div>
          </div>
          <div className={styles.packageItem}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>
                Gói tháng
              </div>
            </div>
            <div className={styles.mainPrice}>
              99.000 ₫/Tháng
            </div>
            <div className={styles.eachMonth}>

            </div>
            <div className={styles.registerBtn}>
              Mua gói tháng
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MemberPackage
