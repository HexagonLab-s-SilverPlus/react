import React, { useState, useEffect } from 'react';
import styles from './EMGWarning.module.css'
const EMGWarning = ({onCloseModal, emgUUID}) => {
    const [timeLeft, setTimeLeft] = useState(5); // 남은 시간 (초)

    // 30초 타이머 시작
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime === 1) {
                    clearInterval(timer);
                    // 타이머가 끝나면 자동으로 확인 누르기
                    handleEMGConfirm(); // 타이머가 끝나면 자동으로 확인을 누름
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer); // 컴포넌트가 unmount되면 타이머를 클리어
        
    }, []);

    const handleEMGConfirm = async () => {
        await fetch('http://localhost:5000/emg/cancel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: emgUUID,
            }),
        });
        onCloseModal();
    };

    // 확인 버튼 클릭
    const handleCancel = () => {
        onCloseModal();
    };

    return (
        <div>
            <div>
                <div>
                    <h2 className={styles.message}>위급 상황이 아니면 확인을 선택해 주세요</h2>
                    <p>{timeLeft}초 남음</p>
                    <div  >
                        <button onClick={handleCancel} className={styles.modalButton}>확인</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EMGWarning;