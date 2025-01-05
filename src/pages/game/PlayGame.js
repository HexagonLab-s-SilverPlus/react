// src/pages/game/PlayGame.js
import React,{useState,useEffect} from 'react';
// css
import styles from './PlayGame.module.css';
// components
import SeniorNavbar from '../../components/common/SeniorNavbar';




const PlayGame = () => {
  // 플레이어 카드 목록
  const [playerCards, setPlayerCards] = useState([]);
  // 상대방 카드 목록
  const [opponentCards, setOpponentCards] = useState([]);
  // 테이블 카드 목록
  const [tableCards, setTableCards] = useState([]);
  // turn 저장 변수(player or opponent)
  const [currentTurn, setCurrentTurn] = useState('player');

  // 초기 카드 세팅(한번실행)
  useEffect(()=>{
    const initialCards = generateInitialCards();
    setPlayerCards(initialCards.player);
    setOpponentCards(initialCards.opponent);
    setTableCards(initialCards.table);
  },[]);

  // 카드 초기화 로직
  const generateInitialCards = () => {
    // TODO : 실제 카드 섞기 로직 추가
    return{ // 섞은카드 분배
      player:[],
      opponent:[],
      table:[],
    };
  };

  // 플레이어가 카드를 낼 때
  const handleCardPlay = (card) => {
    if (currentTurn !== 'player') return; // 플레이어 턴이 아닐 경우 무시
    console.log(`플레어가 ${card} 카드를 냈습니다.`);

    // 카드 플레이 로직 (세부구현 필요)
    setTableCards([...tableCards,card]); // 카드 테이블에 추가
    setPlayerCards(playerCards.filter((c)=>c !== card)); // 플레이어 카드 제거

    // 턴 넘기기
    setCurrentTurn('opponent');
  };

  // 컴퓨터 턴 처리
  useEffect(()=>{
    if (currentTurn ==='opponent'){
      const timer = setTimeout(() =>{
        handleComputerPlay();
      }, 1000); // 1초 대기후 실행
      return () => clearTimeout(timer);
    }
  },[currentTurn]);

  const handleComputerPlay = () => {
    if (opponentCards.length === 0 ) return; // 컴퓨터 카드가 없으면 종료
    const card = opponentCards[0]; // 간단히 첫 번째 카드 선택
    console.log(`컴퓨터가 ${card} 카드를 냈습니다.`);

    setTableCards([...tableCards,card]); // 카드 테이블에 추가
    setOpponentCards(opponentCards.slice(1)); // 컴퓨터 카드제거( 첫번째 카드 )

    // 턴 넘기기
    setCurrentTurn('player');
  };

  return (
    <div className={styles.mainPage}>
      <div className={styles.gameNavBar}>
        <SeniorNavbar/>
      </div>
      <div className={styles.gameArea}>
        {/* 상대방 카드 */}
        <div className={styles.opponentArea}>
          {opponentCards.map((_, index) => (
            <img key={index} src={`/assets/images/game/card/back.png`} alt="상대방 카드" className={styles.card}/>
          ))}
        </div>

        {/* 테이블 카드 */}
        <div className={styles.tableArea}>
          {tableCards.map((card, index)=>(
            <img key={index} src={`/assets/images/game/card/${card}`} alt="테이블 카드" className={styles.card}/>
          ))}
        </div>

        {/* 플레이어 카드 */}
        <div className={styles.playerArea}>
          {playerArea.map((card,index)=>(
            <img key={index} src={`/assets/images/game/card/${card}`} alt="플레이어 카드" className={styles.card} onClick={()=>handleCardPlay(card)}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayGame;
