// src/pages/game/playAction.js
export const selectCard = (card, firstCard, tableCards, turnPlayerCards, turnPlayerGetCards, turnPlayerAmassList)=>{
    console.log("내가 낸 패 : ",card);
    console.log("덱에서 뒤집힌 패 : ",firstCard);
    // 변수----------------------------------------------------------------
    // 플레이어가 얻은 카드
    let getCardList =[];
    // 테이블에 내려놓을 카드
    let pushCardList =[];
    // 테이블에서 빠질 카드
    let outTableCardList=[];
    // return변수 -----------------------------------------------------------------------
    // 사용자 보유카드
    let playerCard = [...turnPlayerCards];
    // 테이블 카드 리스트
    let tableCard = [...tableCards];
    // 플레이어가 획득한 카드 
    let getPlayerCard =[...turnPlayerGetCards];
    // 상대방 패 뺏어올 수 있는 갯수
    let takeAwayCard = 0;
    // 싼 카드
    const amassList =[];
    

    // 폭탄카드
    const otherCard = ([
        { id:51, month : 50, type:"폭탄", detailType:"폭탄", image:"bomb.png"},
        { id:52, month : 50, type:"폭탄", detailType:"폭탄", image:"bomb.png"},
    ]);
    // 플레이어 카드 빼기
        const updatedPlayerCards = playerCard.filter((playerCard) => playerCard.id !== card.id);
        playerCard=[...updatedPlayerCards];
    //3장 한번에(폭탄) 낼때 -------------------------------------------------------
    // 자신의 덱에 같은패가 3장인지 확인
    let cardCount = 0;
    // 같은카드 3개일시 사용될 리스트
    const threeCardList = [];
    playerCard.forEach((myCard)=>{
        if (myCard.month===card.month){
        cardCount = cardCount+1;
        threeCardList.push(myCard);
        }
    });
    if (cardCount==2){
        const updateThreeCard = playerCard.filter((playerCard)=>!threeCardList.some((card) => card.id === playerCard.id));
        playerCard=[...updateThreeCard,otherCard[0],otherCard[1]];
        getCardList=[...threeCardList];
        takeAwayCard = takeAwayCard+1;
        
    }
    // 자신의 카드와 덱카드 동일카드 저장----------------------------------------------
    // 플레이어가 낸 카드와 일치하는 달인 테이블카드 리스트
    const sameCardToPlayer = [];
    // 덱에서 나온 카드와 일치하는 달인 테이블카드 리스트
    const sameCardToDeck =[];
    // 테이블 카드에서 확인하여 리스트 뽑기
    tableCards.forEach((tableCard) => {
        if(card.month === tableCard.month){
            sameCardToPlayer.push(tableCard);
        }
        if(firstCard.month===tableCard.month){
            sameCardToDeck.push(tableCard);
        }
    });
    // 플레이어가 제출한 카드와 일치한 카드의 갯수 확인하고 리스트에 담기-----------------
    // 테이블에서 같은 카드 0개일때
    if (sameCardToPlayer.length === 0){
        // 플레이어카드 = 덱카드 일때
        if(card.month === firstCard.month){
            takeAwayCard = takeAwayCard+1;
            getCardList.push(card,firstCard);
        // 테이블에서 덱카드와 같은 카드가 0개일때
        } else if (sameCardToDeck.length === 0 ){
            pushCardList.push(card,firstCard);
        // 테이블에서 덱카드와 같은 카드가 1개일때
        } else if (sameCardToDeck.length === 1){
            getCardList.push(firstCard,...sameCardToDeck);
            pushCardList.push(card);
            outTableCardList.push(...sameCardToDeck);
        // 테이블에서 덱카드와 같은 카드가 2개일때
        } else if (sameCardToDeck.length === 2){
            getCardList.push(firstCard,sameCardToDeck[0]);
            pushCardList.push(card);
            outTableCardList.push(sameCardToDeck[0]);
        // 테이블에서 덱카드와 같은 카드가 3개일때
        } else if (sameCardToDeck.length === 3){
            takeAwayCard = takeAwayCard+1;
            getCardList.push(firstCard,...sameCardToDeck);
            pushCardList.push(card);
            outTableCardList.push(...sameCardToDeck);
        }

    // 테이블에서 같은 카드 1개일때
    } else if(sameCardToPlayer.length === 1){
        // 플레이어카드 = 덱카드 일때
        if(card.month === firstCard.month){
            amassList.push(card);
            pushCardList.push(card,firstCard);
        // 테이블에서 덱카드와 같은 카드가 0개일때
        } else if (sameCardToDeck.length === 0 ){
            getCardList.push(card,...sameCardToPlayer);
            pushCardList.push(firstCard);
            outTableCardList.push(...sameCardToPlayer);
        // 테이블에서 덱카드와 같은 카드가 1개일때
        } else if (sameCardToDeck.length === 1){
            getCardList.push(card,firstCard,...sameCardToPlayer,...sameCardToDeck);
            outTableCardList.push(...sameCardToPlayer,...sameCardToDeck);
        // 테이블에서 덱카드와 같은 카드가 2개일때
        } else if (sameCardToDeck.length === 2){
            getCardList.push(card,firstCard,...sameCardToPlayer,sameCardToDeck[0]);
            outTableCardList.push(...sameCardToPlayer,sameCardToDeck[0]);
        // 테이블에서 덱카드와 같은 카드가 3개일때
        } else if (sameCardToDeck.length === 3){
            getCardList.push(card,firstCard,...sameCardToPlayer,...sameCardToDeck);
            pushCardList.push(card);
            outTableCardList.push(...sameCardToPlayer,...sameCardToDeck);
        }
        
    // 테이블에서 같은 카드 2개일때
    } else if(sameCardToPlayer.length === 2){
        // 플레이어카드 = 덱카드 일때
        if(card.month === firstCard.month){
            getCardList.push(card,firstCard,...sameCardToPlayer);
            outTableCardList.push(...sameCardToPlayer);
        // 테이블에서 덱카드와 같은 카드가 0개일때
        } else if (sameCardToDeck.length === 0 ){
            getCardList.push(card,sameCardToPlayer[0]);
            pushCardList.push(firstCard);
            outTableCardList.push(sameCardToPlayer[0]);
        // 테이블에서 덱카드와 같은 카드가 1개일때
        } else if (sameCardToDeck.length === 1){
            getCardList.push(card,firstCard,sameCardToPlayer[0],...sameCardToDeck);
            outTableCardList.push(sameCardToPlayer[0],...sameCardToDeck);
        // 테이블에서 덱카드와 같은 카드가 2개일때
        } else if (sameCardToDeck.length === 2){
            getCardList.push(card,firstCard,sameCardToPlayer[0],sameCardToDeck[0]);
            outTableCardList.push(sameCardToPlayer[0],sameCardToDeck[0]);
        // 테이블에서 덱카드와 같은 카드가 3개일때
        } else if (sameCardToDeck.length === 3){
            getCardList.push(card,firstCard,sameCardToPlayer[0],...sameCardToDeck);
            outTableCardList.push(sameCardToPlayer[0],...sameCardToDeck);
        }
        
    // 테이블에서 같은 카드 3개일때
    } else if(sameCardToPlayer.length === 3){
        // 테이블에서 덱카드와 같은 카드가 0개일때
        if (sameCardToDeck.length === 0 ){
            getCardList.push(card,...sameCardToPlayer);
            pushCardList.push(firstCard);
            outTableCardList.push(...sameCardToPlayer);
        // 테이블에서 덱카드와 같은 카드가 1개일때
        } else if (sameCardToDeck.length === 1){
            getCardList.push(card,firstCard,...sameCardToPlayer,...sameCardToDeck);
            outTableCardList.push(...sameCardToPlayer,...sameCardToDeck);
        // 테이블에서 덱카드와 같은 카드가 2개일때
        } else if (sameCardToDeck.length === 2){
            getCardList.push(card,firstCard,...sameCardToPlayer,sameCardToDeck[0]);
            outTableCardList.push(...sameCardToPlayer,sameCardToDeck[0]);
        // 테이블에서 덱카드와 같은 카드가 3개일때
        } else if (sameCardToDeck.length === 3){
            getCardList.push(card,firstCard,...sameCardToPlayer,...sameCardToDeck);
            outTableCardList.push(...sameCardToPlayer,...sameCardToDeck);
        }
    }
    
    //결과리턴----------------------------------------------------------------
    console.log("얻은패 : ",getCardList);
    console.log("테이블 추가패 : ",pushCardList);
    console.log("테이블 제거패 : ",outTableCardList);
    // 내가 얻은카드 
    if (getCardList.length!==0){
        getPlayerCard=[...getPlayerCard,...getCardList];
    };
    // 테이블에 카드 넣기
    if (pushCardList.length !== 0){
        tableCard=[...tableCard,...pushCardList];
    };
    // 테이블에 카드빼기
    if (outTableCardList.length !==0){
        tableCard = tableCard.filter((tableCard) => !outTableCardList.some((card) => card.id === tableCard.id));
    };
    // 폭탄 제거하기
    tableCard = tableCard.filter((card)=>card.month !== 50);
    return { gpc : getPlayerCard, pc: playerCard, tc : tableCard, cnt: takeAwayCard , amass: amassList};
};




