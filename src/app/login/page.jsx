import React from 'react'
import styles from './login.module.scss'

import Image from 'next/image'
const Login = () => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.main}>
        <p className={styles.sign} align="center">Chào mừng bạn đến với Mori</p>
        <div className={styles.loginButtons}>
          <button>
            <Image src="/google.png" width={20}
              height={20} />
            Tiếp tục với Google</button>
          <button><Image src="/facebook.png" width={20}
            height={20} />Tiếp tục với Facebook</button>
        </div>
      </div>
    </div>
  )
}

export default Login
