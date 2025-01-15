// src/pages/member/EnrollSelect.js
import React, { useState } from 'react';
import styles from './EnrollSelect.module.css';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import SeniorFooter from '../../components/common/SeniorFooter';

const EnrollSelect = () => {
  const navigate = useNavigate();

  const handleMoveEnrollManager = () => {
    navigate('/enrollmanager');
  };
  const handleMoveEnrollFamily = () => {
    navigate('/enrollfamily');
  };

  return (
    <>
      <Header />
      <div className={styles.enrollButton}>
        <div>
          <button onClick={handleMoveEnrollManager} className={styles.button1}>
            기관 담당자
            <br />
            회원가입
          </button>
        </div>
        <div>
          <button onClick={handleMoveEnrollFamily} className={styles.button2}>
            가족(보호자)
            <br /> 회원가입
          </button>
        </div>
      </div>
      <div className={styles.footer}>
        <SeniorFooter />
      </div>
    </>
  );
};

export default EnrollSelect;
