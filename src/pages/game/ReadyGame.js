// src/pages/Home.js
import React, { useState } from 'react';
import styles from './ReadyGame.module.css';
import { useNavigate } from 'react-router-dom';
// import background from '../assets/images/game/other/background.png';

const ReadyGame = () => {
  // 사용자 이름을 관리하는 변수
  const [playerName, setPlayerName] = useState('');

  // 페이지 이동을 위한 네비 함수 적용용
  const nav = useNavigate();

  // 사용자 이름 저장 및 페이지 이동동
  const handleStartClick = () => {
    alert(playerName);
    // 페이지 이동
    nav(`/game/${playerName}`);
  };

  return (
    <div className={styles.mainPage}>
      <h1>맞고 게임에 오신것을 환영합니다.😊</h1>
      <p>플레이어 이름을 입력하고 게임을 시작해보세요.</p>
      <input
        type="text"
        placeholder="플레이어 이름"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={handleStartClick}>게임시작</button>
    </div>
  );
};

export default ReadyGame;
