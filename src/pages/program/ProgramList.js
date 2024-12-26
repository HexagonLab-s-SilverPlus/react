// src/pages/program/ProgramList.jsx
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiSpringBoot } from "../../utils/axios";
import styles from './ProgramList.module.css';
import SideBar from '../../components/common/SideBar';
import PagingDiv4 from '../../components/common/PagingDiv4';
import pgImage from '../../assets/images/pgImage.png';

const ProgramList = () => {
    const [programs, setPrograms] = useState([]);
    const [programFiles, setProgramFiles] = useState([]);

    //검색
    const [selectedOption, setSelectedOption] = useState('');

    //페이징
    const [pagingInfo, setPagingInfo] = useState({
        currentPage: 1,
        maxPage: 1,
        startPage: 1,
        endPage: 1,
    });

    const navigate = useNavigate();

    //program list
    const fetchPrograms = async (page) => {
        try {
            const response = await apiSpringBoot.get(`/program?page=${page}`);
            setPrograms(response.data.list);
            setPagingInfo(response.data.paging);
            console.log(response.data.paging);
        } catch (error) {
            console.log("fetchPrograms Error : {}", error); // 에러 메시지 설정
            alert('어르신 프로그램 불러오기에 실패하였습니다.');
        }
    };

    useEffect(() => {
        fetchPrograms(1);
    }, []);

    const handlePageChange = async (page) => {
        fetchPrograms(page);
    }

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
                            {programs.map((item) => {
                                const {program, fileUrls} = item;   //프로그램 데이터와 파일 URL 분리
                                const firstImageUrl = fileUrls && fileUrls.length > 0
                                    ? fileUrls[0] : pgImage;
                                
                                return(
                                    <li key={program.snrProgramId} className={styles.pgListItem}>
                                        <div className={styles.pgListImgWrap}>
                                            <img src={firstImageUrl} className={styles.pgImage} />
                                        </div>
                                        <div className={styles.pgListTextWrap}>
                                            <p>{program.snrTitle}</p>
                                            <p><span>기간 : </span>{program.snrStartedAt.split('T')[0]} ~ {program.snrEndedAt.split('T')[0]}</p>
                                            <p><span>장소 : </span>{program.snrOrgName}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>{/* pgList end */}
                    </div>{/* pgListWrap end */}
                </div>{/* secContent end */}

                <PagingDiv4
                    currentPage={pagingInfo.currentPage || 1}
                    maxPage={pagingInfo.maxPage || 1}
                    startPage={pagingInfo.startPage || 1}
                    endPage={pagingInfo.endPage || 1}
                    onPageChange={(page) => handlePageChange(page)}
                />
            </section>{/* pgRSection end */}
        </div>
    );
};

export default ProgramList;