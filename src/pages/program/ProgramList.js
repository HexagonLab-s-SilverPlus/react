// src/pages/program/ProgramList.js
import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
    const navigate = useNavigate();
    const location = useLocation();

    const [programs, setPrograms] = useState([]);
    const snrPgListRef = useRef(null); // snrPgList 요소를 참조하기 위한 useRef

    //토큰정보 가져오기(AuthProvider)
    const { role, member } = useContext(AuthContext);

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];        // 현재 날짜 가져오기

    // 초기 상태 정의
    const initPagingInfo = {
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
    };

    // 상태 복원 또는 초기화 (SENIOR 전용)
    const [pagingInfo, setPagingInfo] = useState(() => {
        if (role === "SENIOR") {
            return location.state?.pagingInfo || initPagingInfo;
        }
        return initPagingInfo;
    });

    const [isNearby, setIsNearby] = useState(() => {
        if (role === "SENIOR") {
            return location.state?.isNearby ?? true;
        }
        return false; // SENIOR가 아닌 경우 기본값
    });

    const [searchAction, setSearchAction] = useState('all'); // select의 value
    const [searchKeyword, setSearchKeyword] = useState(''); // input의 value

    //--------------------------------------------------
    const handleScrollToTop = () => {
        if (snrPgListRef.current) {
            snrPgListRef.current.scrollTop = 0; // 스크롤 맨 위로 설정
        }
    };

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

    // 검색 select 변경 핸들러
    const handleSelectChange = (e) => {
        const { value } = e.target;
        setSearchAction(value);
        setPagingInfo((prev) => ({
            ...prev,
            action: value,
            pageNumber: 1, // 검색 조건 변경 시 항상 1페이지로 초기화
        }));
    };

    // 검색 input 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchKeyword(value);
        setPagingInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 목록 페이지로 이동
    const handleListClick = () => {
        setSearchAction('all'); // select 초기화
        setSearchKeyword(''); // input 초기화

        if (role === "SENIOR") {
            if (isNearby) {
                // 내 주변 프로그램일 때 새로고침
                setPagingInfo((prev) => ({
                    ...prev,
                    pageNumber: 1, // 페이지 번호 초기화
                }));
                handleProgramView(1, 'nearby'); // 내 주변 목록 로드
            } else {
                // 전국 어르신 프로그램일 때 검색 조건 초기화 및 전체 목록 로드
                setSearchAction('all'); // select 초기화
                setSearchKeyword(''); // input 초기화
                setPagingInfo((prev) => ({
                    ...prev,
                    pageNumber: 1,
                    action: 'all', // 전체 검색으로 초기화
                    keyword: '',   // 검색어 초기화
                    startDate: formattedDate,
                    endDate: formattedDate,
                }));
                handleProgramView(1, 'all'); // 전국 목록 로드
            }
        } else {
            // 시니어가 아닌 경우 초기 페이징 설정으로 목록 출력
            // setSearchAction('all'); // select 초기화
            // setSearchKeyword(''); // input 초기화
            setPagingInfo(initPagingInfo); // 초기 페이징 설정으로 리셋
            handleProgramView(initPagingInfo.pageNumber, initPagingInfo.action);
        }

        handleScrollToTop(); // 스크롤 맨 위로
    };

    //디테일 페이지로 이동
    const handleMoveDetailView = (snrProgramId) => {
        navigate(`/program/detail/${snrProgramId}`, { state: { pagingInfo, isNearby } });
    };

    useEffect(() => {
        const loadPrograms = async () => {
            const action = isNearby && role === "SENIOR" ? 'nearby' : pagingInfo.action;
            // console.log('Initial API Call with Page:', pagingInfo.pageNumber, 'and Action:', action);

            try {
                const params = {
                    ...pagingInfo,
                    pageNumber: pagingInfo.pageNumber,
                    action: action,
                    keyword: pagingInfo.keyword,
                    startDate: pagingInfo.startDate + " 00:00:00",
                    endDate: pagingInfo.endDate + " 00:00:00",
                };

                // SENIOR 사용자만 memUUID 추가
                if (isNearby && role === "SENIOR") {
                    params.memUUID = member.memUUID;
                }

                let response = await apiSpringBoot.get(`/program`, { params });

                setPrograms(response.data.list);
                // console.log("API Response:", response.data.list);
                // console.log("listCount:", response.data.search.listCount);

                // 페이지 계산
                const { maxPage, startPage, endPage } = PagingDiv8Calculate(
                    response.data.search.pageNumber,
                    response.data.search.listCount,
                    response.data.search.pageSize,
                    8 // 그룹 크기
                );

                // console.log("Paging Calculation:", { maxPage, startPage, endPage });

                setPagingInfo((prev) => ({
                    ...prev,
                    maxPage,
                    startPage,
                    endPage,
                    startDate: formatDate(response.data.search.startDate),
                    endDate: formatDate(response.data.search.endDate),
                    listCount: response.data.search.listCount,
                }));
                navigate(location.pathname, { replace: true });
            } catch (error) {
                // console.error('handleProgramView Error:', error);
                alert('어르신 프로그램 목록을 불러오는데 실패하였습니다.');
            }
        };

        // if (pagingInfo.pageNumber !== 1 || pagingInfo.action === 'all') {
        // 페이지 번호가 변경되었거나 전체 조회 시만 데이터를 불러옴
        loadPrograms();
        // }

    }, [pagingInfo.pageNumber, isNearby]);

    const handlePageChange = async (page) => {
        const currentPage = page || 1; // page 값이 없을 경우 기본값으로 1 설정
        //console.log("Current Page:", currentPage);

        setPagingInfo((prev) => ({
            ...prev,
            pageNumber: page, // 선택된 페이지 번호로 업데이트
        }));

        handleProgramView(currentPage, pagingInfo.action);
        handleScrollToTop(); // 스크롤 맨 위로
    };

    //isNearby 상태 변경 이벤트 핸들러
    const toggleNearbyView = () => {
        // console.log('before isNearby status : ', isNearby);

        setIsNearby((prev) => {
            const updated = !prev; // 상태를 반전
            // console.log('after isNearby status : ', updated); // 상태 변경 후 값 확인
            return updated; // 새로운 상태 반환
        });

        // select와 input 상태 초기화
        setSearchAction("all"); // "선택"으로 초기화
        setSearchKeyword("");   // 빈 문자열로 초기화

        // 페이지 번호를 초기화
        setPagingInfo((prev) => ({
            pageNumber: 1,
            listCount: 1,
            pageSize: 8,
            maxPage: 1,
            startPage: 1,
            endPage: 1,
            action: 'all', // 기본 검색 옵션으로 초기화
            keyword: '',   // 검색어 초기화
            startDate: formattedDate, // 기본 날짜 초기화
            endDate: formattedDate,
        }));

        handleScrollToTop(); // 스크롤 맨 위로
    };

    //페이지 불러오기
    const handleProgramView = async (page, action) => {
        const groupSize = 8; // 그룹 크기 정의
        try {
            const params = {
                ...pagingInfo,
                pageNumber: page,
                action: isNearby && role === "SENIOR" ? 'nearby' : action,
                keyword: pagingInfo.keyword,
                startDate: pagingInfo.startDate + " 00:00:00",
                endDate: pagingInfo.endDate + " 00:00:00",
            };

            // SENIOR 사용자만 memUUID 추가
            if (isNearby && role === "SENIOR") {
                params.memUUID = member.memUUID;
            }

            let response = await apiSpringBoot.get(`/program`, { params });

            setPrograms(response.data.list);
            // console.log("API Response:", response.data.list);

            //페이지 계산
            const { maxPage, startPage, endPage } = PagingDiv8Calculate(response.data.search.pageNumber,
                response.data.search.listCount, response.data.search.pageSize, groupSize);
            // console.log("Paging Calculation:", { maxPage, startPage, endPage });

            setPagingInfo((prev) => ({
                ...prev,
                maxPage: maxPage,
                startPage: startPage,
                endPage: endPage,
                startDate: formatDate(response.data.search.startDate),
                endDate: formatDate(response.data.search.endDate),
                listCount: response.data.search.listCount,
            }));

        } catch (error) {
            // console.log('handleProgramView Error : {}', error);
            alert('어르신 프로그램 목록을 불러오는데 실패하였습니다.');
        }
    };

    //검색 버튼 클릭
    const handleSearchClick = () => {
        handleProgramView(1, pagingInfo.action);
        handleScrollToTop(); // 스크롤 맨 위로
    };

    const renderSearchInputs = () => {
        //Enter 누르면 검색 버튼 클릭됨
        const handleKeyPress = (e) => {
            if (e.key === "Enter") {
                handleSearchClick();
            }
        };

        switch (searchAction) {
            case "pgDate":
                return (
                    <div className={styles.pgDateWrap}>
                        <input
                            type="date"
                            name="startDate"
                            value={pagingInfo.startDate}
                            onChange={handleInputChange}
                        />
                        <span> ~ </span>
                        <input
                            type="date"
                            name="endDate"
                            value={pagingInfo.endDate}
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
                        value={searchKeyword} // input 상태 바인딩
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
                        {isNearby === false ? (
                            <div className={styles.pgSearchWrap}>
                                <select name="action" value={searchAction} onChange={handleSelectChange} className={styles.searchSelect}>
                                    <option value="all">선택&nbsp;&nbsp;</option>
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

                        <div className={[styles.snrPgList, 'masked-overflow'].join(' ')}
                            style={{ height: isNearby ? '90%' : '80%' }}
                            ref={snrPgListRef} // snrPgList 요소에 ref 추가
                        >
                            {(programs || []).map((item) => {
                                const { program, pgfiles } = item;   //프로그램 데이터와 파일 URL 분리

                                return (
                                    <div className={styles.snrPgListItem} key={program.snrProgramId}>
                                        <a onClick={() => handleMoveDetailView(program.snrProgramId)}>
                                            <h1>{program.snrTitle}</h1>
                                            <p>{program.snrOrgName}</p>
                                            <span>내용이 궁금하면 클릭해보세요!</span>
                                        </a>
                                    </div>
                                );
                            })}

                            <button type="button" className={styles.pgListBtn} onClick={handleListClick}>목록</button>

                            <PagingDiv8
                                pageNumber={pagingInfo.pageNumber || 1}
                                currentPage={pagingInfo.currentPage || 1}
                                pageSize={pagingInfo.pageSize}
                                maxPage={pagingInfo.maxPage || 1}
                                startPage={pagingInfo.startPage || 1}
                                endPage={pagingInfo.endPage || 1}
                                onPageChange={(page) => {
                                    handlePageChange(page);
                                }}
                            />
                        </div>{/* snrPgList end */}

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
                                {(role === "MANAGER") && (
                                    <button type="button" onClick={handleWriteClick}>등록하기</button>
                                )}
                            </div>


                            <div className={styles.pgSearchWrap}>
                                <select name="action" value={searchAction} onChange={handleSelectChange} className={styles.searchSelect}>
                                    <option value="all">선택&nbsp;&nbsp;</option>
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
                                    const { program, pgfiles } = item;   //프로그램 데이터와 파일 URL 분리

                                    //image MIME 타입 필터링 후 첫 번째 파일 가져오기
                                    const firstImageFile = pgfiles && pgfiles.find(file => file.mimeType.startsWith('image/'));
                                    const firstImageUrl = firstImageFile ? `data:${firstImageFile.mimeType};base64,${firstImageFile.fileContent}` : pgImage;

                                    return (
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
                            handlePageChange(page);
                        }}
                    />
                </section>{/* pgRSection end */}
            </div>
        );
    }// else end
};

export default ProgramList;