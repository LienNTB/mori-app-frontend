import React from 'react'
import styles from './home.module.scss'
import Header from '@/components/Header/Header'
import Hero from '@/components/Hero/Hero'
import Features from '@/components/Features/Features'
import Testimonials from '@/components/Testimonials/Testimonials'
import Newsletter from '@/components/Newsletter/Newsletter'

const LandingPage = () => {
  return (
    <div className={styles.landingPageContainer}>
      <div className={styles.landingPageContent}>
        <Hero />
        <Features />
        <Testimonials />
        <Newsletter />
      </div>
    </div>
  )
}

export default LandingPage
