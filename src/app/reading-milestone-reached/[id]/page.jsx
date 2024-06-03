"use client"
import Features from '@/components/Features/Features'
import Hero from '@/components/Hero/Hero'
import Newsletter from '@/components/Newsletter/Newsletter'
import Testimonials from '@/components/Testimonials/Testimonials'
import React, { useEffect, useState } from 'react'
import styles from './style.module.scss'
import { useParams } from 'next/navigation'
import { getReadingGoalByIdRequest } from '@/app/redux/saga/requests/readingGoal'

export default function ReadingMilestoneReached() {
  const params = useParams()
  const id = params.id
  const [readingGoal, setReadingGoal] = useState(null)

  useEffect(() => {
    getReadingGoalByIdRequest(id).then(resp => {
      setReadingGoal(resp.data)
    })
  }, [])

  return (
    <div className={styles.landingPageContainer}>
      <div className={styles.landingPageContent}>
        {
          readingGoal ?
            <Hero readingGoal={readingGoal} />
            : <></>
        }
      </div>
    </div>
  )
}
