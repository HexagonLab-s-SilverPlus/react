
// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo2.png'; // 로고 이미지 임포트
import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.container3}>
        <div className={styles.container2}>
            <img src={logo} alt="Site Logo"/> 
        </div>
        <ul className={styles.navList}>
            <li>
              <Link to="/">
                홈
              </Link>
            </li>
            <li>
              <Link to="/qna">
                홍세
              </Link>
            </li>
            <li>
              <Link to="/smmain">
                상무
              </Link>
            </li>
            <li>
              <Link to="/tjmain">
                태장
              </Link>
            </li>
            <li>
              <Link to="/sjmain">
                수진
              </Link>
            </li>
            <li>
              <Link to="/simain">
                서이
              </Link>
            </li>
            <li>
              <Link to="/eymain">
                은영
              </Link>
            </li>
          </ul>
    </div>
  );
}

export default Home;