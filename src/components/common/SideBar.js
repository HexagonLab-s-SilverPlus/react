import React, { useContext } from 'react';
import styles from './SideBar.module.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';

function SideBar() {
  const { isLoggedIn, logout, refreshToken, authInfo } =
    useContext(AuthContext);

  const handleLogout = () => {
    if (isLoggedIn) {
      logout({ refreshToken });
      console.log('로그아웃');
      console.log('authInfo', authInfo);
      alert('로그아웃 성공');
    }
  };

  return (
    <header className={styles.sideBarHeader}>
      <Link to="/" className={styles.sideTitle}>
        실버플러스
      </Link>
      <ul className={styles.sideBar}>
        <li>
          <Link to="/">검색</Link>
        </li>
        <li>
          <Link to="/">계정관리</Link>
        </li>
        <li>
          <Link to="/">공지사항</Link>
        </li>
        <li>
          <Link to="/">어르신 맞춤 활동</Link>
        </li>
        <li>
          <Link to="/">전자책</Link>
        </li>
        <li>
          <Link to="/qna">Q&A</Link>
        </li>
        <li>
          <Link to="/">마이페이지</Link>
        </li>
      </ul>
      <ul className={styles.logout}>
        {isLoggedIn ? (
          <li>
            <button
              style={{
                backgroundColor: '#064420',
                color: '#ffffff',
                fontSize: '28px',
                border: 'none',
                boxShadow: 'none',
                outline: 'none',
                cursor: 'pointer',
              }}
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </li>
        ) : (
          <li>
            <Link to="/loginmember">로그인</Link>
          </li>
        )}
      </ul>
    </header>
  );
}

export default SideBar;
