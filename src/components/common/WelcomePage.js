import React, { useEffect, useState, useRef } from 'react';
import styles from './WelcomePage.module.css';
import backgroundImage from '../../assets/images/background.png';
import granfa from '../../assets/images/granfa.png';
import manager from '../../assets/images/mgr.png';
import admin from '../../assets/images/developer.png'
import family from '../../assets/images/familiy.png';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const secondSectionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const totalHeight = secondSectionRef.current
                ? secondSectionRef.current.offsetTop + secondSectionRef.current.offsetHeight - windowHeight
                : 2000; // 기본값
            const scrollProgress = scrollTop / totalHeight;
            setScrollPosition(Math.min(scrollProgress, 1));
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    const handleLoginClick = () => {
        navigate('/senior-menu'); // SeniorMenu 페이지로 이동
    }

    return (
        <div>
            {/* 첫 번째 섹션 */}
            <div className={styles.backgroundContainer}
                style={{
                    transform: `translateY(-${scrollPosition * 50}vh)`,
                    opacity: `${1 - scrollPosition * 1.5}`,
                    transition: 'transform 0.5s ease, opacity 0.5s ease',
                }}

            >
                <img
                    src={backgroundImage}
                    alt="배경 이미지"
                    className={styles.backgroundImage}
                    style={{
                        transform: `scale(${1 + scrollPosition * 0.7})`,
                        filter: `brightness(${1 - scrollPosition * 0.2})`,
                    }}
                />
                <div
                    className={styles.initialText}
                    style={{
                        opacity: `${1 - scrollPosition * 2}`,
                    }}
                >
                    어르신, 혹시 말동무가 필요하신가요?<br />
                    실버플러스의 AI 말동무 서비스로 대화를 시작해 보세요!
                </div>

                {/* 하단 화살표 */}
                {scrollPosition < 0.95 && (
                    <div className={styles.scrollArrow} onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}>
                        스크롤 내려서 로그인하기<br />
                        ↓
                    </div>
                )}
            </div>

            {/* 두 번째 섹션 */}
            <div
                className={styles.secondSection}
                ref={secondSectionRef}
                style={{
                    transition: 'opacity 0.5s ease',
                }}
            >
                <h1 className={styles.sectionTitle}>어르신들의 행복을 위해서 우리는 노력합니다</h1>
                <p className={styles.sectionDescription}>
                    저희 뿐만이 아니라 담당자, 가족 분들도 어르신들을 생각합니다. <br />또한 각자의 방식으로 어르신을 돌봅니다.
                </p>
                <div className={styles.imageGrid}>
                    <div className={styles.imageCard}>
                        <img src={granfa} alt="어르신" className={styles.image} />
                        <div className={styles.overlay}>
                            <div className={styles.roleTitle}>어르신</div>
                            <div className={styles.roleDescription}>
                                어르신께서는 AI 말동무 서비스를 통해 대화를 즐기고, <br />문서 작성 지원을 받을 수 있습니다.
                            </div>
                        </div>
                    </div>
                    <div className={styles.imageCard}>
                        <img src={manager} alt="담당자" className={styles.image} />
                        <div className={styles.overlay}>
                            <div className={styles.roleTitle}>담당자</div>
                            <div className={styles.roleDescription}>
                                담당자는 어르신의 정보 관리와 위험 상황 관리를 지원합니다.
                            </div>
                        </div>
                    </div>
                    <div className={styles.imageCard}>
                        <img src={family} alt="가족" className={styles.image} />
                        <div className={styles.overlay}>
                            <div className={styles.roleTitle}>가족</div>
                            <div className={styles.roleDescription}>
                                가족은 어르신의 정보를 조회하고 필요한 지원을 제공합니다.
                            </div>
                        </div>
                    </div>
                    <div className={styles.imageCard}>
                        <img src={admin} alt="관리자" className={styles.image} />
                        <div className={styles.overlay}>
                            <div className={styles.roleTitle}>관리자</div>
                            <div className={styles.roleDescription}>
                                관리자는 전체 서비스와 콘텐츠를 관리합니다.
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.loginSection}>
                    <p className={styles.loginDescription}>
                        로그인을 통해 더 많은 서비스를 이용해 보세요!
                    </p>
                    <button className={styles.loginButton} onClick={handleLoginClick}>
                        로그인 <span className={styles.arrowRight}>→</span>
                    </button>
                </div>


            </div>
        </div>
    );
};

export default WelcomePage;
