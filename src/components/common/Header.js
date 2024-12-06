// src/components/common/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png'; // 로고 이미지
import styles from './Header.module.css'; // CSS Modules

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const[현재상태값저장변수, 상태값변경함수] = useState(초기상태값)
  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <header className={styles.header}>
      {/* 로고 및 네비게이션 */}
      <div className={styles.leftSection}>
        <Link to="/" className={styles.logoLink}>
          <img src={logo} alt="Site Logo" className={styles.logo} />
        </Link>
        <nav>
          <ul className={styles.navList}>
            <li>
              <Link to="/" className={styles.navItem}>
                홈
              </Link>
            </li>
            <li>
              <Link to="/hsmain" className={styles.navItem}>
                홍세
              </Link>
            </li>
            <li>
              <Link to="/smmain" className={styles.navItem}>
                상무
              </Link>
            </li>
            <li>
              <Link to="/tjmain" className={styles.navItem}>
                태장
              </Link>
            </li>
            <li>
              <Link to="/sjmain" className={styles.navItem}>
                수진
              </Link>
            </li>
            <li>
              <Link to="/simain" className={styles.navItem}>
                서이
              </Link>
            </li>
            <li>
              <Link to="/eymain" className={styles.navItem}>
                은영
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* 검색바 */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className={styles.searchInput}
        />
        <button className={styles.searchButton}>검색</button>
      </div>

      {/* 로그인/로그아웃 버튼 */}
      <div className={styles.rightSection}>
        {isLoggedIn ? (
          <button onClick={handleLoginLogout} className={styles.authButton}>
            로그아웃
          </button>
        ) : (
          <>
            <Link to="/login" className={styles.authButton}>
              로그인
            </Link>
            <span className={styles.separator}>|</span>
            <Link ink to="/signup" className={styles.authButton}>
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
