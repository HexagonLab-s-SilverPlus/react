// src/pages/game/playAction.js
export const selectCard = (card, firstCard, tableCards)=>{
    // 플레이어가 낸 카드와 일치하는 달인 테이블카드 리스트
    const sameCardToPlayer = [];
    // 덱에서 나온 카드와 일치하는 달인 테이블카드 리스트
    const sameCardToDeck =[];
    // return할 변수
    // 플레이어가 얻은 카드
    const getCardList =[];
    // 테이블에 내려놓을 카드
    const pushCardList =[];
    // 테이블에서 빠질 카드
    const outTableCardList=[];

    // 테이블 카드에서 확인하여 리스트 뽑기
    tableCards.forEach((tableCard) => {
        if(card.month === tableCard.month){
            sameCardToPlayer.push(tableCard);
        }
        if(firstCard.month===tableCard.month){
            sameCardToDeck.push(tableCard);
        }
    });
    
    // 플레이어가 제출한 카드와 일치한 카드의 갯수 확인
    // 테이블에서 같은 카드 0개일때
    if (sameCardToPlayer.length === 0){
        // 플레이어카드 = 덱카드 일때
        if(card.month === firstCard.month){
            getCardList.push(card,firstCard);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        // 테이블에서 덱카드와 같은 카드가 0개일때
        } else if (sameCardToDeck.length === 0 ){
            pushCardList.push(card,firstCard);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        // 테이블에서 덱카드와 같은 카드가 1개일때
        } else if (sameCardToDeck.length === 1){
            getCardList.push(firstCard,...sameCardToDeck);
            pushCardList.push(card);
            outTableCardList.push(...sameCardToDeck);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        // 테이블에서 덱카드와 같은 카드가 2개일때
        } else if (sameCardToDeck.length === 2){
            getCardList.push(firstCard,sameCardToDeck[0]);
            pushCardList.push(card);
            outTableCardList.push(sameCardToDeck[0]);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        // 테이블에서 덱카드와 같은 카드가 3개일때
        } else if (sameCardToDeck.length === 3){
            getCardList.push(firstCard,...sameCardToDeck);
            pushCardList.push(card);
            outTableCardList.push(...sameCardToDeck);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        }

    // 테이블에서 같은 카드 1개일때
    } else if(sameCardToPlayer.length === 1){
        // 플레이어카드 = 덱카드 일때
        if(card.month === firstCard.month){
            pushCardList.push(card,firstCard);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        // 테이블에서 덱카드와 같은 카드가 0개일때
        } else if (sameCardToDeck.length === 0 ){
            getCardList.push(card,...sameCardToPlayer);
            pushCardList.push(firstCard);
            outTableCardList.push(...sameCardToPlayer);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        // 테이블에서 덱카드와 같은 카드가 1개일때
        } else if (sameCardToDeck.length === 1){
            getCardList.push(card,firstCard,...sameCardToPlayer,...sameCardToDeck);
            outTableCardList.push(...sameCardToPlayer,...sameCardToDeck);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        // 테이블에서 덱카드와 같은 카드가 2개일때
        } else if (sameCardToDeck.length === 2){
            getCardList.push(card,firstCard,...sameCardToPlayer,sameCardToDeck[0]);
            outTableCardList.push(...sameCardToPlayer,sameCardToDeck[0]);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        // 테이블에서 덱카드와 같은 카드가 3개일때
        } else if (sameCardToDeck.length === 3){
            getCardList.push(card,firstCard,...sameCardToPlayer,...sameCardToDeck);
            pushCardList.push(card);
            outTableCardList.push(...sameCardToPlayer,...sameCardToDeck);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        }
        
    // 테이블에서 같은 카드 2개일때
    } else if(sameCardToPlayer.length === 2){
        // 플레이어카드 = 덱카드 일때
        if(card.month === firstCard.month){
            getCardList.push(card,firstCard,...sameCardToPlayer);
            outTableCardList.push(...sameCardToPlayer);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        // 테이블에서 덱카드와 같은 카드가 0개일때
        } else if (sameCardToDeck.length === 0 ){
            getCardList.push(card,sameCardToPlayer[0]);
            pushCardList.push(firstCard);
            outTableCardList.push(sameCardToPlayer[0]);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        // 테이블에서 덱카드와 같은 카드가 1개일때
        } else if (sameCardToDeck.length === 1){
            getCardList.push(card,firstCard,sameCardToPlayer[0],...sameCardToDeck);
            outTableCardList.push(sameCardToPlayer[0],...sameCardToDeck);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        // 테이블에서 덱카드와 같은 카드가 2개일때
        } else if (sameCardToDeck.length === 2){
            getCardList.push(card,firstCard,sameCardToPlayer[0],sameCardToDeck[0]);
            outTableCardList.push(sameCardToPlayer[0],sameCardToDeck[0]);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        // 테이블에서 덱카드와 같은 카드가 3개일때
        } else if (sameCardToDeck.length === 3){
            getCardList.push(card,firstCard,sameCardToPlayer[0],...sameCardToDeck);
            outTableCardList.push(sameCardToPlayer[0],...sameCardToDeck);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        }
        
    // 테이블에서 같은 카드 3개일때
    } else if(sameCardToPlayer.length === 3){
        // 테이블에서 덱카드와 같은 카드가 0개일때
        if (sameCardToDeck.length === 0 ){
            getCardList.push(card,...sameCardToPlayer);
            pushCardList.push(firstCard);
            outTableCardList.push(...sameCardToPlayer);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        // 테이블에서 덱카드와 같은 카드가 1개일때
        } else if (sameCardToDeck.length === 1){
            getCardList.push(card,firstCard,...sameCardToPlayer,...sameCardToDeck);
            outTableCardList.push(...sameCardToPlayer,...sameCardToDeck);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        // 테이블에서 덱카드와 같은 카드가 2개일때
        } else if (sameCardToDeck.length === 2){
            getCardList.push(card,firstCard,...sameCardToPlayer,sameCardToDeck[0]);
            outTableCardList.push(...sameCardToPlayer,sameCardToDeck[0]);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        // 테이블에서 덱카드와 같은 카드가 3개일때
        } else if (sameCardToDeck.length === 3){
            getCardList.push(card,firstCard,...sameCardToPlayer,...sameCardToDeck);
            outTableCardList.push(...sameCardToPlayer,...sameCardToDeck);
            return { getCards: getCardList, pushCards: pushCardList, outCards: outTableCardList };
        }
        
    }
};




