import { Checkbox, Radio, RadioGroup } from '@nextui-org/react';
import React from 'react'
import styles from './CollectionSidebar.module.scss'

const CollectionSidebar = ({ handleChange }) => {
  return (
    <div className={styles.collectionSideBarContainer}>
      <div className={styles.filterType}>
        <div className={styles.header}>Sắp xếp</div>
        <div className={styles.content}>
          <RadioGroup
            defaultValue="A"
            onChange={(e) => {
              handleChange(e);
            }}
          >
            <Radio size="sm" value="ascName">
              Tên A → Z
            </Radio>
            <Radio size="sm" value="descName">
              Tên Z → A
            </Radio>
            <Radio size="sm" value="descPrice">
              Giá giảm dần
            </Radio>
            <Radio size="sm" value="ascPrice">
              Giá tăng dần
            </Radio>
          </RadioGroup>

        </div>
        <div className={styles.ruler}></div>
      </div>

      <div className={styles.filterType}>
        <div className={styles.header}>Loại sản phẩm</div>
        <div className={styles.content} style={{ display: "grid" }}>
          <Checkbox size="sm" color="success">
            Đồ gia dụng
          </Checkbox>
          <Checkbox size="sm" color="success">
            Thời trang xanh
          </Checkbox>
          <Checkbox size="sm" color="success">
            Hàng ưu đãi
          </Checkbox>
        </div>
      </div>
    </div>

  );
}

export default CollectionSidebar
