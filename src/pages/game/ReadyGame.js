// src/pages/game/ReadyGame.js
import React, { useContext } from 'react';
import styles from './ReadyGame.module.css';
import { useNavigate } from 'react-router-dom';
// AuthContext
import {AuthContext} from '../../AuthProvider';
// components
import SeniorNavbar from '../../components/common/SeniorNavbar';


const ReadyGame = () => {
  // 페이지 이동을 위한 네비 함수 적용용
  const nav = useNavigate();
  // AuthContext
  const {member} = useContext(AuthContext); 

  return (
    <div className={styles.mainPage}>
      <div className={styles.gameNavBar}>
        <SeniorNavbar/>
      </div>
      <div className={styles.gameWelcome}>
        <p>
          {member.memName}님 카드맞추기 게임에 오신것을 환영합니다.<br/>
          게임시작 버튼을 눌러 게임을 시작해 보세요.😊
        </p>
        <button onClick={()=>(nav('/game/play'))}>게임시작</button> &nbsp;
        <button onClick={()=>(nav('/senior-menu'))}>뒤로가기</button>
      </div>
    </div>
  );
};

export default ReadyGame;
