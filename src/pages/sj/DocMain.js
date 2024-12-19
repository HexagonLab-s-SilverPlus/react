// src/pages/sj/DocMain.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DocMain.module.css';

const  DocMain = () => {

    const navigator = useNavigate();

  const handleAddresClick = () => {
    navigator('/addresMain'); //전입신고서 페이지로 이동
  }

  const handleDeathClick = () => {
    navigator('/deathMain'); //사망신고서 페이지로 이동
  }
  const handleMedicalClick = () => {
    navigator('/medical'); //의료급여 신청서 페이지로 이동
  }
  const handleBasicClick = () => {
    navigator('/basic'); //기초 연금 신청서 페이지로 이동
  }

  return (
    <div className={styles['card-container']}>
      <h2 className={styles.title}>원하시는 공문서를 선택해주세요!</h2> 
      <button className={styles.card} onClick={handleAddresClick}>전입신고서</button>
      <button className={styles.card} onClick={handleDeathClick}>사망신고서</button>
      <button className={styles.card} onClick={handleMedicalClick}>의료급여 신청서</button>
      <button className={styles.card} onClick={handleBasicClick}>기초연금 신청서</button>

    </div>
    
  );
}

export default DocMain;
