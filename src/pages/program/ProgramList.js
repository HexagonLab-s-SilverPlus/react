// src/pages/program/ProgramList.jsx
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiSpringBoot } from "../../utils/axios";
import styles from './ProgramList.module.css';
import SideBar from '../../components/common/SideBar';
import pgImage from '../../assets/images/pgImage.png';

const ProgramList = () => {
    const [programs, setPrograms] = useState([]);

    //검색
    const [selectedOption, setSelectedOption] = useState('');

    const navigate = useNavigate();

    //program list
    const fetchPrograms = async () => {
        try {
            const response = await apiSpringBoot.get(`/program`);
            setPrograms(response.data.list);
            console.log(response.data.list);
        } catch (error) {
            console.log("fetchPrograms Error : {}", error); // 에러 메시지 설정
            alert('어르신 프로그램 불러오기에 실패하였습니다.');
        }
    };

    // useEffect(() => {
    //     fetchPrograms();
    // }, []);

    //등록하기 페이지로 이동 핸들러
    const handleWriteClick = () => {
        navigate('/program/write');
    };

    //검색 옵션 변경 핸들러
    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    return (
        <div className={styles.pgContainer}>
            <SideBar />
            <section className={styles.pgRSection}>
                <div className={styles.secTop}>
                    <p>어르신 프로그램</p>
                </div>{/* .secTop end */}

                <div className={styles.secContent}>
                    <div className={styles.pgListTop}>
                        <p className={styles.pgTitle}>어르신 프로그램 목록 <span>0</span></p>
                        <button type="button" onClick={handleWriteClick}>등록하기</button>

                        <div className={styles.pgSearchWrap}>
                            <select value={selectedOption} onChange={handleOptionChange}>
                                <option>선택&nbsp;&nbsp;</option>
                                <option value="pgTitle">제목&nbsp;&nbsp;</option>
                                <option value="pgContent">내용&nbsp;&nbsp;</option>
                                <option value="pgArea">지역&nbsp;&nbsp;</option>
                                <option value="pgOrg">기관명&nbsp;&nbsp;</option>
                                <option value="pgDate">참여기간&nbsp;</option>
                            </select>
                            
                            {selectedOption === "pgDate" ? (
                                <div className={styles.pgDateWrap}>
                                    <input type="date" />
                                    <span> ~ </span>
                                    <input type="date" />
                                </div>
                            ) : (
                                <input type="search" placeholder="검색어를 입력하세요."/>
                            )}

                            <button type="submit">검색</button>
                        </div>{/* pgSearchWrap end */}
                    </div>{/* pgListTop end */}
                    
                    <div className={styles.pgListWrap}>
                        <ul className={styles.pgList}>
                            <li className={styles.pgListItem}>
                                <div className={styles.pgListImgWrap}>
                                    <img src={pgImage} className={styles.pgImage} />
                                </div>
                                <div className={styles.pgListTextWrap}>
                                    <p>제목</p>
                                    <p><span>기간 : </span>2024-12-25 ~ 24-12-31</p>
                                    <p><span>장소 : </span>한국ICT인재개발원</p>
                                </div>
                            </li>{/* pgList > li */}
                            {programs.map((program, programFile) => (
                                <li key={program.snrProgramId} className={styles.pgListItem}>
                                    <div className={styles.pgListImgWrap}>
                                        <img src={pgImage} className={styles.pgImage} />
                                    </div>
                                    <div className={styles.pgListTextWrap}>
                                        <p>{program.snrTitle}</p>
                                        <p><span>기간 : </span>{program.snrStartedAt} ~ {program.snrEndedAt}</p>
                                        <p><span>장소 : </span>{program.snrOrgName}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>{/* pgList end */}
                    </div>{/* pgListWrap end */}
                </div>{/* secContent end */}
            </section>{/* pgRSection end */}
        </div>
    );
};

export default ProgramList;