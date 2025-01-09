// src/pages/game/PlayGame.js
import React,{useState,useEffect} from 'react';
// css
import styles from './PlayGame.module.css';
// components
import SeniorNavbar from '../../components/common/SeniorNavbar';
// resources
import hwatuCard from './cardInfo';
// function
import { selectCard, chooseCard} from './playAction'



const PlayGame = () => {
  // 카드정보
  const cards = hwatuCard;
  // 기타카드
  const otherCard = ([
    // 뒷면
    {month : 99, type:"back", image:"back.png"},
    // 폭탄
    {month : 99, type:"bomb", image:"bomb.png"},
  ]);


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
  // // 테이블에 같은카드 두장일때 선택시 사용할 상태변수
  // const [isTwoCards, setIsTwoCards] = useState(false);
  // // 테이블에 같은카드 두장일때 선택할 옵션
  // const [choiceOptions, setChoiceOptions] = useState([]);

  // turn 저장 변수(player or opponent)
  const [currentTurn, setCurrentTurn] = useState('player');

  // 초기 카드 세팅(한번실행)
  useEffect(()=>{
    const initialCards = generateInitialCards();// 카드 섞고 분배
    setPlayerCards(initialCards.player);  // 플레이어 카드 세팅
    setOpponentCards(initialCards.opponent);  // 상대방 카드 세팅
    setTableCards(initialCards.table);  // 테이블 카드 세팅
    setDeckCards(initialCards.deck);  // 덱 카드 세팅
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

  // 카드 id순서대로 정렬
  const sortCard = (cards) => {
    const ascCard = [...cards].sort((a,b) => a.id - b.id);
    return ascCard;
  }


  // const handleSelectCard = (card) => {
  //   // 테이블에 있는 같은카드 가져오기
  //   let cards = selectCard(card,tableCards);

  //   // 플레이어가 먹은패에 카드 가져오기
  //   let myCards = chooseCard(cards);

  //   // 카드 처리
  //   // 동일카드가 없을시
  //   if (myCards === 0) {
  //     // 플레이어 패에서 카드빼기
  //     const updatedPlayerCards = playerCards.filter((playerCard) => playerCard.id !== card.id);
  //     setPlayerCards(updatedPlayerCards);
  //     // 플레이어 패를 테이블에 깔기
  //     setTableCards((prev) => [...prev,card]);
  //   } else if(myCards ===1) {
  //     // 플레이어 패에서 카드빼기
  //     let updatedPlayerCards = playerCards.filter((playerCard) => playerCard.id !== card.id);
  //     setPlayerCards(updatedPlayerCards);
  //     // 테이블 패에서 카드빼기
  //     updatedPlayerCards = tableCards.filter((tableCard) => tableCard.id !== cards[0].id);
  //     setTableCards(updatedPlayerCards);
  //     // 플레이어 패와 테이블의 일치하는 패를 내가 먹은 테이블에 넣기
  //     setGetPlayerCards((prev)=>[...prev,card,cards[0]]);
  //   } else if(myCards === 2){
  //     // 둘중 하나 고르기
  //     setIsTwoCards(true);
  //     setChoiceOptions(cards);
  //     // 뒤집을카드 같은거면 두개다 내가 가져가고 

  //     // 아니면 하나만 가져가기
  //   } else if(myCards === 3){
  //     // 플레이어 패에서 카드빼기
  //     let updatedPlayerCards = playerCards.filter((playerCard) => playerCard.id !== card.id);
  //     setPlayerCards(updatedPlayerCards);
  //     // 테이블 패에서 카드빼기
  //     const updatedTableCards = tableCards.filter(
  //       (tableCard) => !cards.some((matchCard) => matchCard.id === tableCard.id));
  //     setTableCards(updatedTableCards);
  //     // 내가 가져간 패에 추가
  //     setGetPlayerCards((prev) => [...prev, ...cards, card]);
  //   }
    
  
  //   // 덱에서 한장꺼내서 뒤집기
  //   if (deckCards!==0){
  //     const [newCard, ...remainingDeck] = deckCards;
  //     setDeckCards(remainingDeck); // 덱 상태 업데이트
  //     setTableCards((prev)=>[...prev,newCard]);  // 테이블 추가
  //   }

  //   // 턴오버 처리
  //   setCurrentTurn("opponent")
  // }

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
            상대방이 먹은패
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
            {}
            <img src={`/assets/images/game/card/back.png`} alt="덱 카드" className={styles.deckCard}/>
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
            {getPlayerCards.map((card)=>(
              <img
                src={`/assets/images/game/card/${card.image}`}
                alt={`${card.month}월 ${card.type} 카드`}
              />
            ))}
          </div>{/* 내가 가져온 패 */}
        </div>{/* 테이블 카드 */}

        {/* 플레이어 카드 */}
        <div className={styles.playerArea}>
                {sortCard(playerCards).map((card)=>(
                  <img
                    key={card.id}
                    src={`/assets/images/game/card/${card.image}`} 
                    alt="플레이어 카드" 
                    onClick={()=>handleSelectCard(card)}
                  />
                ))}
        </div>{/* 플레이어 카드 */}
        {isTwoCards &&
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
        }
      </div>
    </div>
  );
};

export default PlayGame;
