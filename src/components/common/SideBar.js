import React from 'react';
import styles from './SideBar.module.css';
import { Link } from 'react-router-dom';

function SideBar() {

  return (
    <header className={styles.sideBarHeader}>
      <Link to="/" className={styles.sideTitle}>실버플러스</Link>
      <ul className={styles.sideBarul}>
        <li className={styles.sideBarli}><Link to="/" className={styles.sideBarMenu}>검색</Link></li>
        <li className={styles.sideBarli}><Link to="/" className={styles.sideBarMenu}>계정관리</Link></li>
        <li className={styles.sideBarli}><Link to="/" className={styles.sideBarMenu}>공지사항</Link></li>
        <li className={styles.sideBarli}><Link to="/" className={styles.sideBarMenu}>어르신 맞춤 활동</Link></li>
        <li className={styles.sideBarli}><Link to="/" className={styles.sideBarMenu}>전자책</Link></li>
        <li className={styles.sideBarli}><Link to="/" className={styles.sideBarMenu}>Q&A</Link></li>
        <li className={styles.sideBarli}><Link to="/" className={styles.sideBarMenu}>마이페이지</Link></li>
      </ul>
    </header>
  );
}

export default SideBar;