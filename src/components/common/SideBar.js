import React from 'react';
import styles from './SideBar.module.css';
import { Link } from 'react-router-dom';

function SideBar() {

  return (
    <header className={styles.sideBarHeader}>
      <Link to="/" className={styles.sideTitle}>실버플러스</Link>
      <ul className={styles.sideBar}>
        <li><Link to="/">검색</Link></li>
        <li><Link to="/">계정관리</Link></li>
        <li><Link to="/">공지사항</Link></li>
        <li><Link to="/">어르신 맞춤 활동</Link></li>
        <li><Link to="/">전자책</Link></li>
        <li><Link to="/qna">Q&A</Link></li>
        <li><Link to="/">마이페이지</Link></li>
      </ul>
      <ul className={styles.logout}>
        <li><Link to="/">로그아웃</Link></li>
      </ul>
    </header>
  );
}

export default SideBar;