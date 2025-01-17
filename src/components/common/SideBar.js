import React, { useContext } from 'react';
import styles from './SideBar.module.css';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';

function SideBar() {
  const { isLoggedIn, logout, refreshToken, authInfo, role } =
    useContext(AuthContext);

  const handleLogout = () => {
    if (isLoggedIn) {
      logout({ refreshToken });
      console.log('로그아웃');
      console.log('authInfo', authInfo);
    }
  };

  const renderLinks = (links) =>
    links.map(({ path, label, img }) => (
      <li key={path}>
        <NavLink
          to={path}
          className={({ isActive }) =>
            isActive ? `${styles.activeLink}` : ''
          } // 활성화된 링크에 클래스 추가
          onClick={(e) => {
            // 현재 활성화된 경로라면 리렌더링 강제
            if (window.location.pathname === path) {
              e.preventDefault(); // 기본 동작 막기
              window.location.reload(); // 페이지 리로드
            }
          }}
        >
          {img} &nbsp; {label}
        </NavLink>
      </li>
    ));

  const adminLinks = [
    { path: '/mlistview', label: '계정관리', img : <span class="material-symbols-outlined">manage_accounts</span>  },
    { path: '/notice', label: '공지사항', img : <span class="material-symbols-outlined">description</span>  },
    { path: '/program', label: '어르신 프로그램', img : <span class="material-symbols-outlined">diversity_1</span>  },
    { path: '/qna', label: 'Q&A', img : <span class="material-symbols-outlined">help_center</span>  },
    { path: '/myinfoadmin', label: '마이페이지', img : <span class="material-symbols-outlined">account_circle</span>  },
  ];

  const managerLinks = [
    { path: '/sjRouter/dashlist', label: '대시보드', img : <span class="material-symbols-outlined">home</span> },
    { path: '/seniorlist', label: '어르신관리', img : <span class="material-symbols-outlined">manage_accounts</span> },
    { path: '/notice', label: '공지사항', img : <span class="material-symbols-outlined">description</span> },
    { path: '/program', label: '어르신 프로그램', img : <span class="material-symbols-outlined">diversity_1</span> },
    { path: '/book', label: '전자책', img : <span class="material-symbols-outlined">menu_book</span> },
    { path: '/qna', label: 'Q&A', img : <span class="material-symbols-outlined">help_center</span> },
    { path: '/myinfomanager', label: '마이페이지', img : <span class="material-symbols-outlined">account_circle</span> },
  ];

  const familyLinks = [
    { path: '/seniorlist', label: '어르신관리', img : <span class="material-symbols-outlined">manage_accounts</span> },
    { path: '/notice', label: '공지사항', img : <span class="material-symbols-outlined">description</span> },
    { path: '/program', label: '어르신 프로그램', img : <span class="material-symbols-outlined">diversity_1</span> },
    { path: '/qna', label: 'Q&A', img : <span class="material-symbols-outlined">help_center</span> },
    { path: '/myinfofamily', label: '마이페이지', img : <span class="material-symbols-outlined">account_circle</span> },
  ];

  return (
    <header className={styles.sideBarHeader}>
      <NavLink to="/" className={styles.sideTitle}>
        실버플러스
      </NavLink>
      <ul className={styles.sideBar}>
        {role === 'ADMIN' && renderLinks(adminLinks)}
        {role === 'MANAGER' && renderLinks(managerLinks)}
        {role === 'FAMILY' && renderLinks(familyLinks)}
        <div className={styles.logout}>
        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout}><span class="material-symbols-outlined">logout</span> &nbsp; 로그아웃</button>
          </li>
        ) : (
          <li>
            <NavLink to=" /loginmember">로그인</NavLink>
          </li>
        )}
        </div>
      </ul>
    </header>
  );
}

export default SideBar;
