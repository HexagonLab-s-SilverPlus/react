// src/pages/game/PlayGame.js
import React,{useState,useEffect} from 'react';
// css
import styles from './PlayGame.module.css';
// components
import SeniorNavbar from '../../components/common/SeniorNavbar';

const PlayGame = () => {
  // 카드정보
  const cards = ([
    //1월
    { id:1, month : 1, type : "광", detailType:"광", image:"1_1.png"},
    { id:2, month : 1, type : "띠", detailType:"홍단", image:"1_2.png"},
    { id:3, month : 1, type : "피", detailType:"피", image:"1_3.png"},
    { id:4, month : 1, type : "피", detailType:"피", image:"1_4.png"},
    //2월
    { id:5, month : 2, type : "열끗", detailType:"고도리", image:"2_1.png"},
    { id:6, month : 2, type : "띠", detailType:"홍단", image:"2_2.png"},
    { id:7, month : 2, type : "피", detailType:"피", image:"2_3.png"},
    { id:8, month : 2, type : "피", detailType:"피", image:"2_4.png"},
    //3월
    { id:9, month : 3, type : "광", detailType:"광", image:"3_1.png"},
    { id:10, month : 3, type : "띠", detailType:"홍단", image:"3_2.png"},
    { id:11, month : 3, type : "피", detailType:"피", image:"3_3.png"},
    { id:12, month : 3, type : "피", detailType:"피", image:"3_4.png"},
    //4월
    { id:13, month : 4, type : "열끗", detailType:"고도리", image:"4_1.png"},
    { id:14, month : 4, type : "띠", detailType:"초단", image:"4_2.png"},
    { id:15, month : 4, type : "피", detailType:"피", image:"4_3.png"},
    { id:16, month : 4, type : "피", detailType:"피", image:"4_4.png"},
    //5월
    { id:17, month : 5, type : "열끗", detailType:"열끗", image:"5_1.png"},
    { id:18, month : 5, type : "띠", detailType:"초단", image:"5_2.png"},
    { id:19, month : 5, type : "피", detailType:"피", image:"5_3.png"},
    { id:20, month : 5, type : "피", detailType:"피", image:"5_4.png"},
    //6월
    { id:21, month : 6, type : "열끗", detailType:"열끗", image:"6_1.png"},
    { id:22, month : 6, type : "띠", detailType:"청단", image:"6_2.png"},
    { id:23, month : 6, type : "피", detailType:"피", image:"6_3.png"},
    { id:24, month : 6, type : "피", detailType:"피", image:"6_4.png"},
    //7월
    { id:25, month : 7, type : "열끗", detailType:"열끗", image:"7_1.png"},
    { id:26, month : 7, type : "띠", detailType:"초단", image:"7_2.png"},
    { id:27, month : 7, type : "피", detailType:"피", image:"7_3.png"},
    { id:28, month : 7, type : "피", detailType:"피", image:"7_4.png"},
    //8월
    { id:29, month : 8, type : "광", detailType:"광", image:"8_1.png"},
    { id:30, month : 8, type : "열끗", detailType:"고도리", image:"8_2.png"},
    { id:31, month : 8, type : "피", detailType:"피", image:"8_3.png"},
    { id:32, month : 8, type : "피", detailType:"피", image:"8_4.png"},
    //9월
    { id:33, month : 9, type : "띠", detailType:"청단", image:"9_1.png"},
    { id:34, month : 9, type : "피", detailType:"피", image:"9_2.png"},
    { id:35, month : 9, type : "피", detailType:"피", image:"9_3.png"},
    { id:36, month : 9, type : "피", detailType:"쌍피", image:"9_4.png"},
    //10월
    { id:37, month : 10, type : "열끗", detailType:"열끗", image:"10_1.png"},
    { id:38, month : 10, type : "띠", detailType:"청단", image:"10_2.png"},
    { id:39, month : 10, type : "피", detailType:"피", image:"10_3.png"},
    { id:40, month : 10, type : "피", detailType:"피", image:"10_4.png"},
    //11월
    { id:41, month : 11, type : "광", detailType:"광", image:"11_1.png"},
    { id:42, month : 11, type : "피", detailType:"피", image:"11_2.png"},
    { id:43, month : 11, type : "피", detailType:"피", image:"11_3.png"},
    { id:44, month : 11, type : "피", detailType:"쌍피", image:"11_4.png"},
    //12월
    { id:45, month : 12, type : "광", detailType:"비광", image:"12_1.png"},
    { id:46, month : 12, type : "열끗", detailType:"열끗", image:"12_2.png"},
    { id:47, month : 12, type : "띠", detailType:"띠", image:"12_3.png"},
    { id:48, month : 12, type : "피", detailType:"쌍피", image:"12_4.png"},
  ]);

  const otherCard = ([
    // 뒷면
    {type:"back", image:"back.png"},
    // 폭탄
    {type:"bomb", image:"bomb.png"},
  ]);


  // 플레이어 카드 목록
  const [playerCards, setPlayerCards] = useState([]);
  // 상대방 카드 목록
  const [opponentCards, setOpponentCards] = useState([]);
  // 테이블 카드 목록
  const [tableCards, setTableCards] = useState([]);
  // 덱 카드 목록
  const [deckCards, setDeckCards] = useState([]);

  // turn 저장 변수(player or opponent)
  const [currentTurn, setCurrentTurn] = useState('player');

  // 초기 카드 세팅(한번실행)
  useEffect(()=>{
    const initialCards = generateInitialCards();
    setPlayerCards(initialCards.player);
    setOpponentCards(initialCards.opponent);
    setTableCards(initialCards.table);
    setDeckCards(initialCards.deck);
  },[]);

  // 카드 초기화 로직
  const generateInitialCards = () => {
    // 카드 섞기
    const allCards = shuffle(cards);
    return{ // 섞은카드 분배
      player: allCards.slice(0,10), // 10장
      opponent: allCards.slice(10,20), // 10장
      table:allCards.slice(20,28), // 8장
      deck:allCards.slice(28), // 20장
    };
  };

  // 카드 섞기
  const shuffle = (array) => {
    for (let i = array.length - 1; i>0 ; i--){
      const j = Math.floor(Math.random()*(i+1));
      [array[i], array[j]] = [array[j],array[i]]; // swap
    }
    return array;
  };

  // // 플레이어가 카드를 낼 때
  // const handleCardPlay = (card) => {
  //   if (currentTurn !== 'player') return; // 플레이어 턴이 아닐 경우 무시
  //   console.log(`플레어가 ${card} 카드를 냈습니다.`);

  //   // 카드 플레이 로직 (세부구현 필요)
  //   setTableCards([...tableCards,card]); // 카드 테이블에 추가
  //   setPlayerCards(playerCards.filter((c)=>c !== card)); // 플레이어 카드 제거

  //   // 턴 넘기기
  //   setCurrentTurn('opponent');
  // };

  // // 컴퓨터 턴 처리
  // useEffect(()=>{
  //   if (currentTurn ==='opponent'){
  //     const timer = setTimeout(() =>{
  //       handleComputerPlay();
  //     }, 1000); // 1초 대기후 실행
  //     return () => clearTimeout(timer);
  //   }
  // },[currentTurn]);

  // const handleComputerPlay = () => {
  //   if (opponentCards.length === 0 ) return; // 컴퓨터 카드가 없으면 종료
  //   const card = opponentCards[0]; // 간단히 첫 번째 카드 선택
  //   console.log(`컴퓨터가 ${card} 카드를 냈습니다.`);

  //   setTableCards([...tableCards,card]); // 카드 테이블에 추가
  //   setOpponentCards(opponentCards.slice(1)); // 컴퓨터 카드제거( 첫번째 카드 )

  //   // 턴 넘기기
  //   setCurrentTurn('player');
  // };

  return (
    <div className={styles.mainPage}>
      <div className={styles.gameNavBar}>
        <SeniorNavbar/>
      </div>
      <div className={styles.gameArea}>
        {/* 상대방 카드 */}
        <div className={styles.opponentArea}>
          {/* 상대방이 먹은패 */}
          <div className={styles.getOpponentCards}> 상대방이 먹은패 </div>
          <div className={styles.opponentCards}>
            {opponentCards.map((_, index) => (
              <>
              <img key={index} src={`/assets/images/game/card/back.png`} alt="상대방 카드" /> &nbsp;
              {index===4 && <br/>}
              </>
            ))}
          </div>
        </div>

        {/* 테이블 카드 */}
        <div className={styles.tableArea}>
          {/* 덱카드 */}
          <div className={styles.deckCards}>
            <img src={`/assets/images/game/card/back.png`} alt="덱 카드" className={styles.card}/>
          </div>
          <div className={styles.openCards}>
            {tableCards.map((card, index)=>(
              <>
                <img key={index} src={`/assets/images/game/card/${card.image}`} alt="테이블 카드" className={styles.card}/> &nbsp;
              </>
            ))}
          </div>
          <div className={styles.getPlayerArea}>
            내가먹은패
          </div>
        </div>

        {/* 플레이어 카드 */}
        <div className={styles.playerArea}>
          {playerCards.map((card,index)=>(
            <>
              <img key={index} src={`/assets/images/game/card/${card.image}`} alt="플레이어 카드" className={styles.card} onClick={()=>handleCardPlay(card)}/> &nbsp;
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayGame;
