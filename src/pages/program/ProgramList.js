// src/pages/program/ProgramList.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { apiSpringBoot } from "../../utils/axios";
import { AuthContext } from "../../AuthProvider";
import styles from './ProgramList.module.css';
import SideBar from "../../components/common/SideBar";
import PagingDiv8 from '../../components/common/PagingDiv8';
import { PagingDiv8Calculate } from "../../components/common/PagingDiv8Calculate";
import pgImage from '../../assets/images/pgImage.png';

import SeniorNavbar from "../../components/common/SeniorNavbar";
import SeniorFooter from "../../components/common/SeniorFooter";

const ProgramList = () => {
    const [programs, setPrograms] = useState([]);

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];        // 현재 날짜 가져오기

    //페이징
    const [pagingInfo, setPagingInfo] = useState({
        pageNumber: 1,
        listCount: 1,
        pageSize: 8,
        maxPage: 1,
        startPage: 1,
        endPage: 1,
        action: 'all',
        keyword: '',
        startDate: formattedDate,
        endDate: formattedDate,
    });

    const navigate = useNavigate();

    //토큰정보 가져오기(AuthProvider)
    const { role, member } = useContext(AuthContext);
    const [isNearby, setIsNearby] = useState(true);


    //--------------------------------------------------
    //데이터 포맷(한국)
    const formatDate = (w) => {
        const date = new Date(w);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;  //월은 0부터 시작하므로 1더해야 함
        const day = date.getDate();

        return `${year}-${month}-${day}`;
    };

    // 날짜 포맷 함수 추가
    const formatKoreanDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 두 자리로 포맷
        const day = String(date.getDate()).padStart(2, '0'); // 두 자리로 포맷
        return `${year}년 ${month}월 ${day}일`;
    };
    const formattedToday = formatKoreanDate(today); // 오늘 날짜 포맷

    //등록하기 페이지로 이동 핸들러
    const handleWriteClick = () => {
        navigate('/program/write');
    };

    //목록 페이지로 이동
    const handleListClick = () => {
        window.location.reload();   //페이지 새로고침
    };

    //디테일 페이지로 이동
    const handleMoveDetailView = (snrProgramId) => {
        navigate(`/program/detail/${snrProgramId}`);
    };

    const handlePageChange = async (page) => {
        const currentPage = page || 1; // page 값이 없을 경우 기본값으로 1 설정
        console.log("Current Page:", currentPage);
        handleProgramView(currentPage, pagingInfo.action);
    };

    //isNearby 상태 변경 이벤트 핸들러
    const toggleNearbyView = () => {
        console.log('before isNearby status : ', isNearby);
        setIsNearby((prev) => !prev);
        setPagingInfo((prev) => ({
            ...prev,
            pageNumber: 1, // 페이지를 1로 초기화
        }));
        console.log('after isNearby status : ', isNearby);
    };
    
    //내주변 목록
    useEffect(() => {
        console.log('isNearby status updated:', isNearby);
        handleProgramView(1, isNearby ? 'nearby' : 'all');
    }, [isNearby]); // isNearby가 변경될 때 실행

    //페이지 불러오기
    const handleProgramView = async (page, action) => {
        const groupSize = 8; // 그룹 크기 정의
        try {
            console.log('member address : ', member.memAddress);

            let response = null;
            if (isNearby) {
                response = await apiSpringBoot.get(`/program`, {
                    params: {
                        ...pagingInfo,
                        pageNumber: page,
                        action: 'nearby',
                        keyword: pagingInfo.keyword,
                        startDate: pagingInfo.startDate + " 00:00:00",
                        endDate: pagingInfo.endDate + " 00:00:00",
                        memUUID: member.memUUID,
                    },
                });
            } else {
                response = await apiSpringBoot.get(`/program`, {
                    params: {
                        ...pagingInfo,
                        pageNumber: page,
                        action: action,
                        keyword: pagingInfo.keyword,
                        startDate: pagingInfo.startDate + " 00:00:00",
                        endDate: pagingInfo.endDate + " 00:00:00",
                    },
                });
            }
            
            setPrograms(response.data.list);
            console.log("API Response:", response.data.list);
            
            //페이지 계산
            const {maxPage, startPage, endPage} = PagingDiv8Calculate(response.data.search.pageNumber, response.data.search.listCount, response.data.search.pageSize, groupSize);
            console.log("Paging Calculation:", { maxPage, startPage, endPage });

            setPagingInfo(response.data.search);
            setPagingInfo((prev) => ({
                ...prev,
                maxPage: maxPage,
                startPage: startPage,
                endPage: endPage,
                startDate: formatDate(response.data.search.startDate),
                endDate: formatDate(response.data.search.endDate),
            }));
            
        } catch (error) {
            console.log('handleProgramView Error : {}', error);
        }
    };

    
    //전체 목록
    useEffect(() => {
        console.log("Initial API Call with Page:", pagingInfo.pageNumber, "and Action:", pagingInfo.action);
        handleProgramView(pagingInfo.pageNumber, pagingInfo.action);
    }, [pagingInfo.pageNumber, pagingInfo.action]);

    const handleSelectChange = (e) => {
        const {value} = e.target;
        setPagingInfo((prev) => ({
            ...prev,
            action: value,
        }));
    };

    //input 에 입력 시 paging훅에 저장
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPagingInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //검색 버튼 클릭
    const handleSearchClick = () => {
        handleProgramView(pagingInfo.pageNumber, pagingInfo.action);
    };

    useEffect(() => {
        handleProgramView(pagingInfo.pageNumber, pagingInfo.action);
    }, []);

    const renderSearchInputs = () => {
        //Enter 누르면 검색 버튼 클릭됨
        const handleKeyPress = (e) => {
            if (e.key === "Enter") {
                handleSearchClick();
            }
        };

        switch (pagingInfo.action) {
            case "pgDate":
                return (
                    <div className={styles.pgDateWrap}>
                        <input
                            type="date"
                            name="startDate"
                            defaultValue={pagingInfo.startDate}
                            onChange={handleInputChange}
                        />
                        <span> ~ </span>
                        <input
                            type="date"
                            name="endDate"
                            defaultValue={pagingInfo.endDate}
                            onChange={handleInputChange}
                        />
                    </div>
                );
            case "all":
            default:
                return (
                    <input
                        type="search"
                        name="keyword"
                        placeholder="검색어를 입력하세요."
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        className={styles.searchInput}
                    /> 
                );
        }
    };

    //--------------------------------------------------
    if (role === "SENIOR") {
        return (
            <div className={styles.snrPgContainer}>
                <SeniorNavbar />

                <section className={styles.snrPgSection}>
                    <div className={styles.snrPgLeft}>
                        <div className={styles.snrPgLTop}>
                            <p>{formattedToday}</p>
                            <h1>오늘의<br />어르신 프로그램</h1>
                        </div>{/* snrPgLTop end */}

                        <button onClick={toggleNearbyView} style={{ whiteSpace: "pre-line" }}>
                            {isNearby ? "전국 어르신\n 프로그램\n보러가기" : "내 주변\n프로그램\n보러가기"}
                            <span className="material-symbols-outlined">arrow_right_alt</span>
                        </button>
                    </div>{/* snrPgLeft end */}

                    <div className={styles.snrPgRight}>
                        { isNearby === false ? (
                                <div className={styles.pgSearchWrap}>
                                    <select name="action" onChange={handleSelectChange} className={styles.searchSelect}>
                                        <option value="all" selected>선택&nbsp;&nbsp;</option>
                                        <option value="pgTitle">제목&nbsp;&nbsp;</option>
                                        <option value="pgContent">내용&nbsp;&nbsp;</option>
                                        <option value="pgArea">지역&nbsp;&nbsp;</option>
                                        <option value="pgOrg">기관명&nbsp;&nbsp;</option>
                                        <option value="pgDate">참여기간&nbsp;</option>
                                    </select>
                                    
                                    {renderSearchInputs()}

                                    <button type="button" onClick={handleSearchClick} className={styles.searchButton}>검색</button>
                                </div>
                        ) : ('')}
                        
                        <ul className={[styles.snrPgList, 'masked-overflow'].join(' ')} 
                            style={{ height: isNearby ? '90%' : '80%' }}>
                            {(programs || []).map((item) => {
                                const {program, pgfiles} = item;   //프로그램 데이터와 파일 URL 분리
                                    
                                return (
                                    <li className={styles.snrPgListItem} key={program.snrProgramId}>
                                        <a onClick={() => handleMoveDetailView(program.snrProgramId)}>
                                            <h1>{program.snrTitle}</h1>
                                            <p>{program.snrOrgName}</p>
                                            <span>내용이 궁금하면 클릭해보세요!</span>
                                        </a>
                                    </li>
                                );
                            })}
                        <PagingDiv8
                            pageNumber={pagingInfo.pageNumber || 1}
                            currentPage={pagingInfo.currentPage || 1}
                            pageSize={pagingInfo.pageSize}
                            maxPage={pagingInfo.maxPage || 1}
                            startPage={pagingInfo.startPage || 1}
                            endPage={pagingInfo.endPage || 1}
                            onPageChange={(page) => {
                                console.log("Page change triggered:", page);
                                handlePageChange(page);
                            }}
                        />
                        </ul>{/* snrPgList end */}

                    </div>{/* snrPgRight end */}
                </section>{/* snrPgSection end */}

                <SeniorFooter />
            </div>//snrPgContainer end
        );
    } else {
        return (
            <div className={styles.pgContainer}>
                <SideBar />
                <section className={styles.pgRSection}>
                    <div className={styles.secTop}>
                        <p>어르신 프로그램</p>
                    </div>{/* .secTop end */}
    
                    <div className={styles.secContent}>
                        <div className={styles.pgListTop}>
                            <p className={styles.pgTitle}>어르신 프로그램 목록 <span>{pagingInfo.listCount}</span></p>
                            <div className={styles.pgTopBtns}>
                                <button type="button" onClick={handleListClick}>목록</button>
                                {(role === "MANAGER" || role === "ADMIN") && (
                                    <button type="button" onClick={handleWriteClick}>등록하기</button>
                                )}
                            </div>
                                
    
                            <div className={styles.pgSearchWrap}>
                                <select name="action" onChange={handleSelectChange} className={styles.searchSelect}>
                                    <option value="all" selected>선택&nbsp;&nbsp;</option>
                                    <option value="pgTitle">제목&nbsp;&nbsp;</option>
                                    <option value="pgContent">내용&nbsp;&nbsp;</option>
                                    <option value="pgArea">지역&nbsp;&nbsp;</option>
                                    <option value="pgOrg">기관명&nbsp;&nbsp;</option>
                                    <option value="pgDate">참여기간&nbsp;</option>
                                </select>
                                
                                {renderSearchInputs()}
    
                                <button type="button" onClick={handleSearchClick} className={styles.searchButton}>검색</button>
                            </div>{/* pgSearchWrap end */}
                        </div>{/* pgListTop end */}
                        
                        <div className={styles.pgListWrap}>
                            <ul className={styles.pgList}>
                                {(programs || []).map((item) => {
                                    const {program, pgfiles} = item;   //프로그램 데이터와 파일 URL 분리
                                    
                                    //image MIME 타입 필터링 후 첫 번째 파일 가져오기
                                    const firstImageFile = pgfiles && pgfiles.find(file => file.mimeType.startsWith('image/'));
                                    const firstImageUrl = firstImageFile ? `data:${firstImageFile.mimeType};base64,${firstImageFile.fileContent}` : pgImage;
                                    
                                    return(
                                        <li key={program.snrProgramId} className={styles.pgListItem}>
                                            <a onClick={() => handleMoveDetailView(program.snrProgramId)}>
                                                <div className={styles.pgListImgWrap}>
                                                    <img src={firstImageUrl} className={styles.pgImage} />
                                                </div>
                                                <div className={styles.pgListTextWrap}>
                                                    <p>{program.snrTitle}</p>
                                                    <p><span>기간 : </span>{program.snrStartedAt.split('T')[0]} ~ {program.snrEndedAt.split('T')[0]}</p>
                                                    <p><span>장소 : </span>{program.snrOrgName}</p>
                                                </div>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>{/* pgList end */}
                        </div>{/* pgListWrap end */}
                    </div>{/* secContent end */}
    
                    <PagingDiv8
                        pageNumber={pagingInfo.pageNumber || 1}
                        currentPage={pagingInfo.currentPage || 1}
                        pageSize={pagingInfo.pageSize}
                        maxPage={pagingInfo.maxPage || 1}
                        startPage={pagingInfo.startPage || 1}
                        endPage={pagingInfo.endPage || 1}
                        onPageChange={(page) => {
                            console.log("Page change triggered:", page);
                            handlePageChange(page);
                        }}
                    />
                </section>{/* pgRSection end */}
            </div>
        );
    }// else end
};

export default ProgramList;