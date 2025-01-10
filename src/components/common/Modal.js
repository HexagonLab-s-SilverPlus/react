// src//components/common/Modal.js
// 리액트가 제공하는 'Potals' 이용한 모달 컴포넌트
// 'Potals' 는 DOM 의 특정 노드로 React 컴포넌트 트리를 랜더링할 수 있도록 해주는 기능임

import React from 'react';
import ReactDom from 'react-dom';
import styles from './Modal.module.css';

const Modal = ({ children, onClose }) => {
  return ReactDom.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalButtonDiv}>
          <button onClick={onClose} className={styles.closeButton}>
            ✖
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.getElementById('portal-root') // Protals를 사용할 DOM 노드
    // public/index.html 에 노드 추가 지정
  );
};

export default Modal;
