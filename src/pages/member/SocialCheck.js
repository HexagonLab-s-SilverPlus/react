// src/pages/member/SocialCheck.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SocialCheck.module.css';

const SocialCheck = () => {
  const naviagte = useNavigate();

  const handleMoveLogin = () => {
    naviagte('/loginmember');
  };

  const handleMoveEnroll = () => {
    naviagte('/enrollselect');
  };

  return (
    <div className={styles.socialCheckMainContainer}>
      <div className={styles.socialCheckSubContainer}>
        <div className={styles.socialCheckTitle}>
          <p>소셜정보와 연동 확인되는 회원정보를 찾을 수 없습니다.</p>
          <p>가족 회원이시라면 마이페이지에서 소셜 연동을 진행해 주세요.</p>
        </div>
        <div className={styles.socialCheckButtonDiv}>
          <button onClick={handleMoveEnroll}>회원가입 하러가기</button>
          <button onClick={handleMoveLogin}> 로그인 하러가기</button>
        </div>
      </div>
    </div>
  );
};

export default SocialCheck;
