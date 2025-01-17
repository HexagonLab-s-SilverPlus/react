// src/pages/game/ReadyGame.js
import React, { useContext } from 'react';
import styles from './ReadyGame.module.css';
import { useNavigate } from 'react-router-dom';
// AuthContext
import {AuthContext} from '../../AuthProvider';
// components
import SeniorNavbar from '../../components/common/SeniorNavbar';
//image
import info1 from '../../assets/images/game/info1.png';
import info2 from '../../assets/images/game/info2.png';
import info3 from '../../assets/images/game/info3.png';


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
          <div className={styles.gameImgWrap}>
            <div className={styles.gameImgBox}><img className={styles.gameInfoImg} src={info1} /></div>
            <div className={styles.gameImgBox}><img className={styles.gameInfoImg} src={info2}/></div>
            <div className={styles.gameImgBox}><img className={styles.gameInfoImg} src={info3}/></div>
          </div>
          게임시작 버튼을 눌러 게임을 시작해 보세요.😊
        </p>
        <button onClick={()=>(nav('/gameRouter/game/play'))}>게임시작</button> &nbsp;
        <button onClick={()=>(nav('/senior-menu'))}>뒤로가기</button>
      </div>
    </div>
  );
};

export default ReadyGame;
