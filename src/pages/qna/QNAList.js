import React from 'react';
// import { useNavigate } from 'react-router-dom';
import SideBar from '../../components/common/SideBar';
import QNAHeader from '../../components/qna/QNAHeader';
import styles from './QNAList.module.css'
function QNAList() {
  return (
    <div>
      <SideBar />
      <div className={styles.qnaContent}>
        <QNAHeader />
      </div>
    </div>
  );
}

export default QNAList;
