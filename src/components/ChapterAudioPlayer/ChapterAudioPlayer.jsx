import React from 'react'
import styles from "./ChapterAudioPlayer.module.scss"

const ChapterAudioPlayer = ({ chapter, book }) => {
  const playRef = useRef(null);

  return (
    <div className={styles.chapterAudioPlayer}>
      <div className={styles.audioPlayerHeader}>
        <div className={styles.bookInfo}>
          <img className={styles.circleImage} src={book.img} alt="cover" />
          <div className={styles.bookDetails}>
            <span>{chapter.name}</span>
          </div>
        </div>
      </div>
      <div className={styles.audioPayerContainer}>
        <div className={styles.AudioPlayer}>
          <ReactHlsPlayer
            src={chapter.audio}
            autoPlay={false}
            controls={true}
            width="100%"
            height="auto"
            playerRef={playRef}
          />
        </div>
      </div>
    </div>
  );
}

export default ChapterAudioPlayer
