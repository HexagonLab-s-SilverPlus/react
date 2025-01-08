// src/pages/sj/DocMain.js

import { React, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DocMain.module.css';
import { AuthContext } from '../../AuthProvider';

const DocMain = () => {
  const navigate = useNavigate();
   const {member} = useContext(AuthContext);   // AuthProvider 에서 데이터 가져오기
  

  const handleNavigate = (documentType) => {
    // 문서 유형에 따라 채팅 페이지로 이동
    navigate(`/document/${documentType}`);
  };


  const handleCSVNavigate = () => {
    // CSV 파일 버튼 클릭 시 이동
    navigate(`/d/${member.memUUID}`);
  };

  return (
    <div className={styles['card-container']}>
      <h2 className={styles.title}>원하시는 공문서를 선택해주세요!</h2>
      {/* CSV 파일 버튼 추가 */}
      <button className={styles.csvBtn} onClick={handleCSVNavigate}>CSV 파일</button>
      <div className={styles.cardWrap}>
        <button className={styles.card} onClick={() => handleNavigate('address')}>전입신고서</button>
        <button className={styles.card} onClick={() => handleNavigate('death')}>사망신고서</button>
        <button className={styles.card} onClick={() => handleNavigate('medical')}>의료급여 신청서</button>
        <button className={styles.card} onClick={() => handleNavigate('basic')}>기초연금 신청서</button>
      </div>
    </div>
  );
};

export default DocMain;
