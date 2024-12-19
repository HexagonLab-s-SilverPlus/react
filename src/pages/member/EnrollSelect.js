// src/pages/member/EnrollSelect.js
import React, { useState } from 'react';
import styles from './EnrollSelect.module.css';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import EnrollManager from './EnrollManager';

const EnrollSelect = () => {
  const [showEnrollManagerModal, setShowEnrollManagerModal] = useState(false);
  const navigate = useNavigate();
  const handleCloseModal = () => {
    setShowEnrollManagerModal(false);
  };
  const handleEnrollSuccess = () => {
    setShowEnrollManagerModal(false);
    navigate('/loginmember');
  };
  const handleMoveEnrollManager = () => {
    setShowEnrollManagerModal(true);
  };
  const handleMoveEnrollFamily = () => {};
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
      {showEnrollManagerModal && (
        <Modal onClose={handleCloseModal}>
          <EnrollManager onEnrollSuccess={handleEnrollSuccess}></EnrollManager>
        </Modal>
      )}
    </>
  );
};

export default EnrollSelect;
