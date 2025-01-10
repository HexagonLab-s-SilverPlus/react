// src/pages/game/autoChoice.js
export const autoChoice = (opponentCards,tableCards) => {
    const opponent = [...opponentCards];
    const table =[...tableCards];

    opponent.forEach((prev)=>{
        table.forEach((prev2)=>{
            if(prev.month===prev2.month){
                return prev;
            }
        })
    });
    return opponent[0];
    
};