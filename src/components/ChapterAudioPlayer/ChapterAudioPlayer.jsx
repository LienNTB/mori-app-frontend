import React, { useState, useRef, useEffect } from "react";
import styles from "./ChapterAudioPlayer.module.scss";
import Hls from "hls.js";
import * as types from "@/app/redux/types";
const ChapterAudioPlayer = ({ chapter, book }) => {
  const audioRef = useRef(null);
  const hlsRef = useRef(null);
  const encodedChapterAudio = encodeURIComponent(chapter.audio);

  useEffect(() => {
    const audio = audioRef.current;
    const encodedBook = encodeURIComponent(book.name);
    const encodedChapter = encodeURIComponent(chapter.name);
    const encodedChapterAudio = encodeURIComponent(chapter.audio);

    // Kiểm tra xem trình duyệt có hỗ trợ HLS không
    if (Hls.isSupported()) {
      hlsRef.current = new Hls();
      hlsRef.current.loadSource(
        `${types.BACKEND_URL}/api/bookaudio/${encodedBook}/${encodedChapter}/${encodedChapterAudio}`
      );
      hlsRef.current.attachMedia(audio);
    }

    // Bắt đầu với trạng thái là true khi component được gọi
    audio.addEventListener("loadeddata", () => {
      audio.play();
    });
  }, [encodedChapterAudio]);

  return (
    <div className={styles.chapterAudioPlayer}>
      <div className={styles.audioPlayerHeader}>
        <div className={styles.bookInfo}>
          <img
            className={styles.circleImage}
            src={`${types.BACKEND_URL}/api/bookimg/${book.image}`}
            alt="book image"
          />
          <div className={styles.bookDetails}>
            <span>{chapter.name}</span>
          </div>
        </div>
      </div>
      <div className={styles.audioPayerContainer}>
        <div className={styles.audioPlayer}>
          <audio ref={audioRef} controls preload="auto">
            <source
              src={`${types.BACKEND_URL}/api/bookaudio/${encodedChapterAudio}`}
              type="application/x-mpegURL"
            />
          </audio>
        </div>
      </div>
    </div>
  );
};

export default ChapterAudioPlayer;
