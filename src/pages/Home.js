import React from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate();

  const moveBTN = () => {
    navigate(`/qna`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>홈 페이지</h1>
      <p className={styles.description}>여기는 홈 페이지입니다.</p>
      <button onClick={moveBTN}>QNA 이동</button>
    </div>
  );
}

export default Home;