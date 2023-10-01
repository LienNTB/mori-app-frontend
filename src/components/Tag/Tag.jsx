import React from 'react'
import styles from './Tag.module.scss'
import Link from 'next/link'
const Tag = (props) => {
  return (
    <Link href={`/category/${props.link}`}>
      <div className={styles.container}>
        {props.name}
      </div>
    </Link>
  )
}

export default Tag
