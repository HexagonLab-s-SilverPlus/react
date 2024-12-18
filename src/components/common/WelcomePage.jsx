import React from 'react';
import styles from './WelcomePage.module.css';
import arrowIcon from '../../assets/images/Arrow up-circle.png'
import Container from '../../pages/ey/chat/Container';
import { useNavigate } from 'react-router-dom';


function WelcomePage() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/senior-menu'); // SeniorMenu 페이지로 이동
    }
    return (
        <Container>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        안녕하세요? 실버님 <br /> 오늘의 기분은 어떠신가요?
                    </h1>
                    <p className={styles.description}>
                        말씀해 주시면 목소리가 자동으로 입력됩니다. 편하게 대화해 보세요.
                    </p>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            placeholder="오늘 날씨는 어때?"
                            className={styles.input}
                        />
                        <button className={styles.arrowButton}>
                            <img src={arrowIcon} alt="arrow" className={styles.arrowIcon} />
                        </button>
                    </div>
                </div>
                <button className={styles.loginButton} onClick={handleLoginClick}>
                    로그인 <span className={styles.arrowRight}>→</span>
                </button>
            </div>

        </Container>
    );
}

export default WelcomePage;
