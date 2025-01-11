import React, { useEffect, useState, useRef } from 'react';
import styles from './WelcomePage.module.css';
import backgroundImage from '../../assets/images/background.png';
import granfa from '../../assets/images/granfa.png';
import manager from '../../assets/images/mgr.png';
import admin from '../../assets/images/developer.png'
import family from '../../assets/images/familiy.png';

import sangmu from '../../assets/images/sangmu.jpg'; // 상무
import eunyoung from '../../assets/images/eunyoung.jpg'; // 은영
import hongsae from '../../assets/images/hongsae.jpg'; // 홍세
import seoi from '../../assets/images/seoi.jpg'; // 서이
import sujin from '../../assets/images/sujin.jpg'; // 수진
import taejang from '../../assets/images/taejang.jpg'; // 태장


import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const secondSectionRef = useRef(null);
    const developerSectionRef = useRef(null);
    const [hoveredIndex, setHoveredIndex] = useState(null); // 호버 상태 관리
    const [hexagonHovered, setHexagonHovered] = useState(false); // 육각형 호버 상태 관리

    // 팀원 이미지, 이름, 소개
    // text에 어떻게 적을지 방향성 정해보기(자기소개)
    const teamData = [
        { src: sangmu, name: "이상무", text: "~의 이상무입니다." },
        { src: hongsae, name: "김홍세", text: "~의 김홍세입니다." },
        { src: seoi, name: "임서이", text: "~의 임서이입니다." },
        { src: sujin, name: "노수진", text: "~의 노수진입니다." },
        { src: taejang, name: "김태장", text: "~의 김태장입니다." },
        { src: eunyoung, name: "최은영", text: "~의 최은영입니다." },
    ];



    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const totalHeight =
                developerSectionRef.current
                    ? developerSectionRef.current.offsetTop +
                    developerSectionRef.current.offsetHeight - windowHeight
                    : 2000;
            const scrollProgress = scrollTop / totalHeight;
            setScrollPosition(Math.min(scrollProgress, 1));
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);



    const handleScrollToSection = (ref) => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
                        opacity: `${1 - scrollPosition * 2}`, // 스크롤에 따라 투명도만 변경
                        transform: `scale(1)`, // 폰트 크기를 스크롤 애니메이션에서 고정
                    }}
                >
                    어르신, 혹시 말동무가 필요하신가요?<br />
                    실버플러스의 AI 말동무 서비스로 대화를 시작해 보세요!
                </div>

                <div className={styles.scrollArrow} onClick={() => handleScrollToSection(secondSectionRef)}>
                    스크롤 내려서 로그인하기<br />↓
                </div>


            </div>

            {/* 두 번째 섹션 */}
            <div
                className={styles.secondSection}
                ref={secondSectionRef}
                style={{
                    transition: 'transform 0.9s ease, opacity 0.3s ease',
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


                {/* 두 번째 섹션 화살표 */}
                <div
                    className={styles.second_scrollArrow}
                    onClick={() => handleScrollToSection(developerSectionRef)}
                >
                    스크롤 내려서 팀원 소개 보기<br />↓
                </div>

            </div>





            {/* 세 번째 섹션 */}
            <div className={styles.developerSection} ref={developerSectionRef}>
                <h1 className={styles.sectionTitle}>육각형 연구소</h1>
                <div className={styles.hexagonContainer}>
                    <div
                        className={styles.hexagon}
                        onMouseEnter={() => setHexagonHovered(true)} // 육각형 호버 시작
                        onMouseLeave={() => setHexagonHovered(false)} // 육각형 호버 종료
                    >
                        {hexagonHovered ? (
                            <div className={styles.hexagonContent}>
                                <h3>육각형 연구소</h3>
                                <p className={styles.underline}>
                                    6명의 인재가 <br />
                                </p>
                                <br/>
                                <p className={styles.underline}>
                                    균형과 안정, 협력과 융합을 통해 <br />
                                </p>
                                <p className={styles.underline}>
                                    다각적 접근으로 문제를 해결합니다.<br/>
                                </p>
                            </div>
                        ) : hoveredIndex !== null ? (
                            <div className={styles.hexagonContent}>
                                <h3>{teamData[hoveredIndex].name}</h3>
                                <p>{teamData[hoveredIndex].text}</p>
                            </div>
                        ) : null}
                    </div>
                    {teamData.map((team, index) => (
                        <div
                            key={index}
                            className={`${styles.hexCorner} ${styles[`corner${index + 1}`]}`}
                            onMouseEnter={() => setHoveredIndex(index)} // 마우스 호버 시작
                            onMouseLeave={() => setHoveredIndex(null)} // 마우스 호버 종료
                        >
                            <img src={team.src} alt={`팀원 ${team.name}`} className={styles.teamImage} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
