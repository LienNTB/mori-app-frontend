import React, { useState } from 'react'
import styles from './RatingStars.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const RatingStars = ({ setRatingData, currentRating, lockStar }) => {
  const [starHover, setStarHover] = useState(currentRating);
  const [rating, setRating] = useState(5);

  const handleSetRating = (index) => {
    setRating(index);
    setRatingData(index)
  }
  return (
    <div className={styles.reviewStars}>
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <FontAwesomeIcon
            icon={faStar}
            className={
              index <= (starHover || rating)
                ? styles.on
                : styles.off
            }
            onClick={() => !lockStar ? handleSetRating(index) : ""}
            onMouseEnter={() => !lockStar ? setStarHover(index) : ""}
            onMouseLeave={() => !lockStar ? setStarHover(rating) : ""}
          />
        );
      })}
    </div>
  )
}

export default RatingStars
