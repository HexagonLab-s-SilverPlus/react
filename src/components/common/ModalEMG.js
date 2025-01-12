import React from 'react';
import ReactDom from 'react-dom';
import style from './ModalEMG.module.css'; // CSS 모듈 import

const ModalEMG = ({children }) => {
    return ReactDom.createPortal (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <div className={style.modalTitle}>경 고!</div>
        <div className={style.modalMessage}>{children}</div>
      </div>
    </div>,
    document.getElementById('portal-root') // Protals를 사용할 DOM 노드
    // public/index.html 에 노드 추가 지정
  );
};

export default ModalEMG;
