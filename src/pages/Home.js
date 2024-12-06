// src/pages/Home.js
import React from 'react';
import logo from '../assets/images/logo.png'; // 로고 이미지 임포트
import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.container3}>
        <div className={styles.container2}>
            <img src={logo} alt="Site Logo"/> 
        </div>
        <div className={styles.container}>
            <h2>안녕하세요.실버님<br/>오늘의 기분은 어떠신가요?</h2>
            <p>말씀해 주시면 목소리가 자동으로 입력됩니다. 편하게 대화해 보세요.</p>
        </div>
    </div>
  );
}


export default Home;