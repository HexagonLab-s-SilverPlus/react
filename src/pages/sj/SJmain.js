// src/pages/sj/SJmain.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SJmain.module.css';


const SJmain = () => {

  const navigator = useNavigate();

  const handleDocClick = () => {
    navigator('/docmain'); //의료급여 신청서 페이지로 이동
  }
  const handleDashBoardClick = () => {
    navigator('/dashmain'); //기초 연금 신청서 페이지로 이동
  }

  return (
    <div>
      <h2 className={styles.title}>안녕하세요</h2> 
      <button className={styles.card} onClick={handleDocClick}>공문서 메인뷰</button>
      <button className={styles.card} onClick={handleDashBoardClick}>대시보드 메인뷰</button>
 

    </div>
    
  );
}

export default SJmain;