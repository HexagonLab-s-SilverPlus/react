import React, { useContext } from 'react';
import styles from './SideBar.module.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';

function SideBar() {
  const { isLoggedIn, logout, refreshToken, authInfo, role } =
    useContext(AuthContext);

  const handleLogout = () => {
    if (isLoggedIn) {
      logout({ refreshToken });
      console.log('로그아웃');
      console.log('authInfo', authInfo);
      alert('로그아웃 성공');
    }
  };

  if (role === 'ADMIN') {
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
            <Link to="/mlistview">계정관리</Link>
          </li>
          <li>
            <Link to="/notice">공지사항</Link>
          </li>
          <li>
            <Link to="/program">어르신 프로그램</Link>
          </li>
          <li>
            <Link to="/qna">Q&A</Link>
          </li>
          <li>
            <Link to="/myinfoadmin">마이페이지</Link>
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

  if (role === 'MANAGER') {
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
            <Link to="/dashlist">대시보드</Link>
          </li>
          <li>
            <Link to="/seniorlist">어르신관리</Link>
          </li>
          <li>
            <Link to="/notice">공지사항</Link>
          </li>
          <li>
            <Link to="/program">어르신 프로그램</Link>
          </li>
          <li>
            <Link to="/book">전자책</Link>
          </li>
          <li>
            <Link to="/qna">Q&A</Link>
          </li>
          <li>
            <Link to="/myinfomanager">마이페이지</Link>
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

  if (role === 'FAMILY') {
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
            <Link to="/seniorlist">어르신관리</Link>
          </li>
          <li>
            <Link to="/notice">공지사항</Link>
          </li>
          <li>
            <Link to="/program">어르신 프로그램</Link>
          </li>
          <li>
            <Link to="/qna">Q&A</Link>
          </li>
          <li>
            <Link to="/myinfofamily">마이페이지</Link>
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
}
export default SideBar;
