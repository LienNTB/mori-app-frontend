import styles from './home.module.scss'
import Features from '../../components/Features/Features'
import Testimonials from '../../components/Testimonials/Testimonials'
import Newsletter from '../../components/Newsletter/Newsletter'

export default function LandingPage() {
  return (
    <div className={styles.landingPageContainer}>
      <div className={styles.landingPageContent}>
        {/* <Hero /> */}
        <Features />
        <Testimonials />
        <Newsletter />
      </div>
    </div>
  )
}

