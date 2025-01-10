// src/pages/game/PlayGame.js
import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
// css
import styles from './PlayGame.module.css';
// components
import SeniorNavbar from '../../components/common/SeniorNavbar';
// resources
import hwatuCard from './cardInfo';
// function
import { selectCard } from './playAction'
import { autoChoice } from './autoChoice';

const PlayGame = () => {
  // navigate
  const navigate = useNavigate();
  // 카드정보
  const cards = hwatuCard;
  // 플레이어 카드 목록
  const [playerCards, setPlayerCards] = useState([]);
  // 상대방 카드 목록
  const [opponentCards, setOpponentCards] = useState([]);
  // 테이블 카드 목록
  const [tableCards, setTableCards] = useState([]);
  // 덱 카드 목록
  const [deckCards, setDeckCards] = useState([]);
  // 플레이어가 획득한 패
  const [getPlayerCards, setGetPlayerCards] = useState([]);
  // 상대방이 획득한 패
  const [getOpponentCards, setGetOpponentCards] = useState([]);
  // turn 저장 변수(true : player or false : opponent)
  const [currentTurn, setCurrentTurn] = useState(true);
  // 플레이어가 쌓은 카드
  const [amassPlayerList, setAmassPlayerList] = useState([]);
  // 상대방이 쌓은 카드
  const [amassOpponentList, setAmassOpponentList] = useState([]);
  //-----------------------------------------------------------------------------
  // 테이블에 같은카드 두장일때 선택시 사용할 상태변수
  // const [isTwoCards, setIsTwoCards] = useState(false);

  //------------------------------------------------------------------------------
  // 초기 카드 세팅(한번실행)
  useEffect(()=>{
    const initialCards = generateInitialCards();// 카드 섞고 분배
    setPlayerCards(initialCards.player);  // 플레이어 카드 세팅
    setOpponentCards(initialCards.opponent);  // 상대방 카드 세팅
    setTableCards(initialCards.table);  // 테이블 카드 세팅
    setDeckCards(initialCards.deck);  // 덱 카드 세팅
    setGetPlayerCards([]);
    setGetOpponentCards([]);
  },[]);
  // 카드 초기화 로직
  const generateInitialCards = () => {
    // 카드 섞기
    const allCards = shuffle(cards);
    const initialCards = { // 섞은카드 분배
      player: allCards.slice(0,10), // 10장
      opponent: allCards.slice(10,20), // 10장
      table:allCards.slice(20,28), // 8장
      deck:allCards.slice(28), // 20장
    };

    // month 가 같은 카드가 4장인지 검증
    if(isFourCard(initialCards.player)||isFourCard(initialCards.opponent)||isFourCard(initialCards.table)){
      console.log("같은카드 4장");
      return generateInitialCards();
    };
    return initialCards;

  };
  // 같은패가 4장인지 확인
  const isFourCard = (cards) =>{
    const cardGroup = cards.reduce((month,card)=>{
      month[card.month] = (month[card.month]||0)+1;
      return month;
    },{});
    return Object.values(cardGroup).some(count=>count===4);
  };

  // 카드 섞기
  const shuffle = (array) => {
    for (let i = array.length - 1; i>0 ; i--){
      const j = Math.floor(Math.random()*(i+1));  // 랜덤위치 뽑기
      [array[i], array[j]] = [array[j],array[i]]; // swap
    }
    return array;
  };
  // 테이블 오픈된 카드 월별로 묶기 함수
  const groupByMonth = (cards) => {
    return cards.reduce((groups, card) => {
      const { month } = card; // 각 카드의 month 값을 가져옴
      // 기존배열이 없으면 해당월 배열 만들기
      if (!groups[month]) {groups[month] = [];}
      groups[month].push(card);  // 월별 배열에 카드 추가
      return groups;  // 그룹 리턴
    }, {});
  };
  //------------------------------------------------------------------------------------------
  // 카드 id순서대로 정렬
  const sortCard = (cards) => {
    const ascCard = [...cards].sort((a,b) => a.id - b.id);
    return ascCard;
  }
  //-------------------------------------------------------------------------------------------
  // 턴 1회 실시
  const handleSelectCard = (card) => {
    // 뺏어올 카드 수 카운트
    // const takeAwayCard = 0;
    // ------------------------------------------------------------------------------------
    // 턴 플레이어 카드
    const turnPlayerCards = currentTurn
    ? playerCards : opponentCards;
    // 턴 플레이어 겟 카드
    const turnPlayerGetCards = currentTurn
    ? getPlayerCards : getOpponentCards;
    // 턴 플레이어 amass 카드
    const turnPlayerAmassList = currentTurn
    ? amassPlayerList:amassOpponentList;
    // 덱카드에서 하나 뽑기
    const [firstCard, ...remainingDeck] = deckCards;
    setDeckCards(remainingDeck); // 덱카드 셋
    // 카드 처리
    const returnValue = selectCard(card, firstCard, tableCards, turnPlayerCards, turnPlayerGetCards,turnPlayerAmassList);
    // 처리한 카드 변수저장
    // gpc : getPlayerCard, pc: playerCard, tc : tableCard, cnt: takeAwayCard, amass: amassList
    console.log("getPlayerCard : ", returnValue.gpc);
    console.log("playerCard : ", returnValue.pc);
    console.log("tableCard : ", returnValue.tc);
    console.log("takeAwayCard : ", returnValue.cnt);
    console.log("amassList : ", returnValue.amass);

    // 반환카드 세팅
    if(currentTurn){
      setGetPlayerCards(returnValue.gpc);
      setPlayerCards(returnValue.pc);
      setAmassPlayerList((prev)=>[...prev,...returnValue.amass]);
    } else{
      setGetOpponentCards(returnValue.gpc);
      setOpponentCards(returnValue.pc);
      setAmassOpponentList((prev)=>[...prev,...returnValue.amass]);
    }
    setTableCards(returnValue.tc);
    // 턴 교대
    setCurrentTurn((prev)=>(!prev));
  };
  //--------------------------------------------------------------------------------------------------
  // opponent 임의 카드 출력 함수
  useEffect(()=>{
    if (!currentTurn){
    const choiceCard = autoChoice(opponentCards,tableCards);
    handleSelectCard(choiceCard);

  }},[currentTurn]);
  //---------------------------------------------------------------------------------------------------------------------
  // 홈으로 이동버튼
  const handleMoveHome=()=>{
    if(window.confirm('홈으로 이동하시겠습니까?')){navigate('/senior-menu')}
  };
  //------------------------------------------------------------------------------------------------
  return (
    <div className={styles.mainPage}>
      {/* 상단 네비바 */}
      <div className={styles.gameNavBar}>
        <SeniorNavbar/>
      </div>

      {/* 전체뷰 */}
      <div className={styles.gameArea}>
        {/* 상대방 카드 */}
        <div className={styles.opponentArea}>
          {/* 상대방이 먹은패 */}
          <div className={styles.getOpponentCards}>
            {sortCard(getOpponentCards).map((card)=>(
              <img
                src={`/assets/images/game/card/${card.image}`}
                alt={`${card.month}월 ${card.type} 카드`}
              />
            ))}
          </div>{/* 상대방이 먹은패 */}
          {/* 상대방 가지고 있는패(갯수에 맞게 뒷면으로 표시) */}
          <div className={styles.opponentCards}>
            {opponentCards.map((card, index) => (
              <React.Fragment key={card.id}>
              <img src={`/assets/images/game/card/back.png`} alt="상대방 카드" /> &nbsp;
              {index===4 && <br/>}
              </React.Fragment>
            ))}
          </div>{/* 상대방 가지고 있는패(갯수에 맞게 뒷면으로 표시) */}
        </div>{/* 상대방이 먹은패 */}

        {/* 테이블 카드 */}
        <div className={styles.tableArea}>
          {/* 덱카드 */}
          <div className={styles.deckCards}>
            { deckCards.length!==0 &&
              <img src={`/assets/images/game/card/back.png`} alt="덱 카드" className={styles.deckCard}/>
            }
          </div>{/* 덱카드 */}
          {/* 테이블 카드 */}
          <div className={styles.openCards}>
            {Object.entries(groupByMonth(tableCards)).map(([month, cards]) => (
              // 월별 카드 가져오기
              <div key={month} className={styles.tableMonthGroup}>
                {cards.map((card) => (
                  <img
                    key={card.id} // 고유한 id 사용
                    src={`/assets/images/game/card/${card.image}`}
                    alt={`${card.month}월 ${card.type} 카드`}
                  />
                ))}
              </div> // 월별 카드 가져오기
            ))}
          </div>{/* 테이블 카드 */}

          {/* 내가 가져온 패 */}
          <div className={styles.getPlayerArea}>
            {sortCard(getPlayerCards).map((card)=>(
              <img
                src={`/assets/images/game/card/${card.image}`}
                alt={`${card.month}월 ${card.type} 카드`}
              />
            ))}
          </div>{/* 내가 가져온 패 */}
        </div>{/* 테이블 카드 */}

        {/* 플레이어 카드 */}
        <div className={styles.playerArea}>
          <div className={styles.playerCardArea}>
            {sortCard(playerCards).map((card)=>(
              <img
                key={card.id}
                src={`/assets/images/game/card/${card.image}`} 
                alt="플레이어 카드" 
                onClick={()=>handleSelectCard(card)}
              />
            ))}
          </div>
          <div className={styles.playerSide}>
            <button onClick={()=>(handleMoveHome())}>홈으로 이동</button>
          </div>
        </div>{/* 플레이어 카드 */}
        {/* {isTwoCards &&
          <div className={styles.isTwoCards}>
            <div className={styles.twoCardsTitle}>카드를 선택하세요</div>
            <div>
              <div className={styles.twoCards}>
                {choiceOptions.map((option)=>(
                  <img
                    key={option.id}
                    src={`/assets/images/game/card/${option.image}`}
                    alt={`${option.month}월 ${option.type}카드`}
                  />
                ))}
              </div>
            </div>
          </div>
        } */}
      </div>
    </div>
  );
};

export default PlayGame;
