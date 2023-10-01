import React from 'react'
import styles from './Footer.module.scss'
const Footer = () => {
  return (
    <div className={styles.container}>
      <footer>
        <ul className={styles.main}>
          <li>Paid Stories</li>
          <li>Try Premium</li>
          <li>Get the App</li>
          <li>Language</li>
          <li>Writers</li>
          <li>Brand Partnerships</li>
          <li>Jobs</li>
          <li>Press</li>
        </ul>
        <ul className={styles.legal}>
          <li>Terms</li>
          <li>Privacy</li>
          <li>Accessibility</li>
          <li>Help</li>
          <li>© 2023 Mori</li>
        </ul>
      </footer>
    </div>
  )
}

export default Footer
