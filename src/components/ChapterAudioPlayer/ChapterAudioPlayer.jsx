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

    const audioSrc = `${types.BACKEND_URL}/api/bookaudio/${encodedBook}/${encodedChapter}/${encodedChapterAudio}`;

    // Determine the file type based on the file extension
    const isM3U8 = encodedChapterAudio.toLowerCase().endsWith(".m3u8");
    const isMP3 = encodedChapterAudio.toLowerCase().endsWith(".mp3");

    if (isM3U8 && Hls.isSupported()) {
      hlsRef.current = new Hls();
      hlsRef.current.loadSource(audioSrc);
      hlsRef.current.attachMedia(audio);
    } else if (isMP3) {
      audio.src = `${types.BACKEND_URL}/api/bookaudio/${encodedChapterAudio}`;
      audio.load();
    }

    // Auto-play the audio when loaded
    audio.addEventListener("loadeddata", () => {
      audio.play();
    });

    // Clean up Hls.js instance on unmount
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
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
            {encodedChapterAudio.toLowerCase().endsWith(".mp3") && (
              <source
                src={`${types.BACKEND_URL}/api/bookaudio/${encodedChapterAudio}`}
                type="audio/mpeg"
              />
            )}
          </audio>
        </div>
      </div>
    </div>
  );
};

export default ChapterAudioPlayer;
