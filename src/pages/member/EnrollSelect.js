// src/pages/member/EnrollSelect.js
import React, { useState } from 'react';
import styles from './EnrollSelect.module.css';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import EnrollManager from './EnrollManager';
import EnrollFamily from './EnrollFamily';

const EnrollSelect = () => {
  // 버튼 클릭시 모달창이 열리게 하는 상태변수
  const [showModal, setShowModal] = useState(false);
  // 회원가입 선택 시 memType 을 전달하기위한 상태변수
  const [memType, setMemType] = useState('');

  const navigate = useNavigate();

  const handleCloseModal = () => {
    setShowModal(false);
    setMemType('');
  };
  const handleEnrollSuccess = () => {
    setShowModal(false);
    navigate('/loginmember');
    setMemType('');
  };
  const handleMoveEnrollManager = () => {
    setMemType('MANAGER');
    setShowModal(true);
  };
  const handleMoveEnrollFamily = () => {
    setMemType('FAMILY');
    setShowModal(true);
  };

  return (
    <>
      <div className={styles.enrollButton}>
        <div>
          <button onClick={handleMoveEnrollManager} className={styles.button1}>
            기관 담당자 회원가입
          </button>
        </div>
        <div>
          <button onClick={handleMoveEnrollFamily} className={styles.button2}>
            가족(보호자) 회원가입
          </button>
        </div>
      </div>
      {/* 기관담당자 회원가입 */}
      {showModal && (
        <Modal onClose={handleCloseModal}>
          {memType === 'MANAGER' && (
            <EnrollManager
              memType={memType}
              onEnrollSuccess={handleEnrollSuccess}
            ></EnrollManager>
          )}
          {memType === 'FAMILY' && (
            <EnrollFamily
              memType={memType}
              onEnrollSuccess={handleEnrollSuccess}
            ></EnrollFamily>
          )}
        </Modal>
      )}
    </>
  );
};

export default EnrollSelect;
