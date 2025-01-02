// src/pages/program/ProgramList.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { apiSpringBoot } from "../../utils/axios";
import styles from './ProgramList.module.css';
import SideBar from "../../components/common/SideBar";
import PagingDiv8 from '../../components/common/PagingDiv8';
import { PagingDiv8Calculate } from "../../components/common/PagingDiv8Calculate";
import pgImage from '../../assets/images/pgImage.png';

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


    //--------------------------------------------------
    //데이터 포맷(한국)
    const formatDate = (w) => {
        const date = new Date(w);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;  //월은 0부터 시작하므로 1더해야 함
        const day = date.getDate();

        return `${year}-${month}-${day}`;
    };

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

    useEffect(() => {
        console.log("Initial API Call with Page:", pagingInfo.pageNumber, "and Action:", pagingInfo.action);
        handleProgramView(pagingInfo.pageNumber, pagingInfo.action);
    }, [pagingInfo.pageNumber, pagingInfo.action]);

    //페이지 불러오기
    const handleProgramView = async (page, action) => {
        console.log("Sending API request with params:", {
            ...pagingInfo,
            pageNumber: page,
            action: action,
            keyword: pagingInfo.keyword,
            startDate: pagingInfo.startDate + " 00:00:00",
            endDate: pagingInfo.endDate + " 00:00:00",
        });
                    
        
        const groupSize = 8; // 그룹 크기 정의
        try {
            const response = await apiSpringBoot.get(`/program`, {
                params: {
                    ...pagingInfo,
                    pageNumber: page,
                    action: action,
                    keyword: pagingInfo.keyword,
                    startDate: pagingInfo.startDate + " 00:00:00",
                    endDate: pagingInfo.endDate + " 00:00:00",
                },
            });
            
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
                            <button type="button" onClick={handleWriteClick}>등록하기</button>
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
};

export default ProgramList;