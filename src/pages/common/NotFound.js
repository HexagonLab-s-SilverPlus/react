import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 - 페이지를 찾을 수 없습니다.</h1>
      <p className={styles.description}>잘못된 URL입니다. 다시 시도해주세요.</p>
      <Player
        autoplay
        loop
        src="/lottie/doc-loading-anime2.json" // Lottie 파일 경로
        className={styles.lottie}
      />
    </div>
  );
};

export default NotFound;
