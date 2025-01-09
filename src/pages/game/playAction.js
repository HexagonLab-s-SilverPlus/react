// src/pages/game/playAction.js

// 선택한 카드와 같은 카드 뽑기
export const selectCard = (card,tableCards) => {
    // 같은 카드 담을 변수
    const sameCard = [];
    // 반복문으로 같은카드 sameCard 담기
    tableCards.forEach((tableCard) => {
      if(card.month === tableCard.month){
        sameCard.push(tableCard);
      }
    });
    return sameCard;
};

// 카드 동일갯수 확인
export const chooseCard = (cards) =>{
    if (cards.length===0){
        console.log("일치하는 카드가 없습니다.");
        return 0;
    } else if (cards.length===1){
        console.log("일치하는 카드가 한장 있습니다.");
        return 1;
    } else if (cards.length === 2){
        console.log(`일차하는 카드가 ${cards.length}장 있습니다. `);
        return cards.length;
    } else if (cards.length === 3){
        console.log(`일차하는 카드가 ${cards.length}장 있습니다. `);
        return cards.length;
    }
};
