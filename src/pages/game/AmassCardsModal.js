// src/pages/game/AmassCardsModal.js
import React,{useState} from 'react';
// 스타일 파일
import styles from './AmassCardsModal.module.css';

const AmassCardsModal = ({opponentCArs, amassCount}) => {
    // 선택카드 리스트
    const [selectedCards, setSelectedCards] = useState([]);
    // 카드선택 핸들러
    const handleCardClick = (card) => {
        if (selectedCards.includes(card)){
            setSelectedCards(selectedCards.filter((selected)=>selected.id!==card.id));
        } else if (selectedCards.length < amassCount){
            setSelectedCards([...selectedCards,card]);
        }
    };

    // 확인 버튼 클릭시
    const handleConfirm=() =>{
        if (selectedCards.length === amassCount){
            onConfirm(selectedCards);
        } else {
            alert(`카드를 ${amassCount}장 선택해주세요.`);
        }
    };

    return(
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.modalAmassTitle}>카드를 {amassCount}장 선택해주세요.</div>
                <div className={styles.modalAmassCardList}> 
                    {opponentCArs.map((card)=>(
                        <img
                            key={card.id}
                            src={`/assets/images/game/card/${card.image}`}
                            alt={`${card.month}월 ${card.type} 카드`}
                            className={selectedCards.includes(card)? styles.modalAmassSelected : styles.modalAmasscard}
                            onClick={()=>handleCardClick(card)}
                        />
                    ))}
                </div>
                <div className={styles.modalAmassButton}>
                    <button onClick={handleConfirm}>확인</button>
                </div>
            </div>
        </div>
    );
};

export default AmassCardsModal;