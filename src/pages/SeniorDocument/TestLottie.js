import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

const TestLottie = () => {
  return (
    <Player
      autoplay
      loop
      src="/lottie/doc-loading-anime.json" // Lottie 파일 경로
      style={{ height: '100px', width: '100px' }}
    />
  );
};

export default TestLottie;