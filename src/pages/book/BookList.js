// src/pages/book/BookList.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { apiSpringBoot } from "../../utils/axios";
import { AuthContext } from "../../AuthProvider";
import styles from './BookList.module.css';
import SideBar from "../../components/common/SideBar";
import PagingDiv8 from '../../components/common/PagingDiv8';
import { PagingDiv8Calculate } from "../../components/common/PagingDiv8Calculate";
import bkImage from '../../assets/images/pgImage.png';

import SeniorNavbar from "../../components/common/SeniorNavbar";
import SeniorFooter from "../../components/common/SeniorFooter";

const BookList = () => {
    const [books, setBooks] = useState([]);
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
    const { role } = useContext(AuthContext);

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
        navigate('/book/write');
    };

    //목록 페이지로 이동
    // const handleListClick = () => {
        
    //     // 전국 어르신 프로그램일 때 검색 조건 초기화 및 전체 목록 로드
    //     setPagingInfo((prev) => ({
    //         ...prev,
    //         pageNumber: 1,
    //         action: 'all', // 전체 검색으로 초기화
    //         keyword: '',   // 검색어 초기화
    //         startDate: formattedDate,
    //         endDate: formattedDate,
    //     }));
    //     handleBookView(1, 'all'); // 전체 목록 로드
        
    // };

    //디테일 페이지로 이동
    const handleMoveDetailView = (snrBookId) => {
        navigate(`/book/detail/${snrBookId}`);
    };

    useEffect(() => {
        const loadBooks = async () => {
            // const action = pagingInfo.action;
            // console.log('Initial API Call with Page:', pagingInfo.pageNumber, 'and Action:', action);

            try {
                let response = await apiSpringBoot.get(`/book`, {
                    params: {
                        ...pagingInfo,
                        pageNumber: pagingInfo.pageNumber,
                        keyword: pagingInfo.keyword,
                        startDate: pagingInfo.startDate + " 00:00:00",
                        endDate: pagingInfo.endDate + " 00:00:00",
                    },
                });
                console.log("book",response.data.fileList.book);
                setBooks(response.data.fileList);
                //setFiles(response.data.fileList);

                console.log("API Response:", response.data.list);

                // 페이지 계산
                const { maxPage, startPage, endPage } = PagingDiv8Calculate(
                    response.data.search.pageNumber,
                    response.data.search.listCount,
                    response.data.search.pageSize,
                    8 // 그룹 크기
                );

                console.log("Paging Calculation:", { maxPage, startPage, endPage });

                setPagingInfo((prev) => ({
                    ...prev,
                    maxPage,
                    startPage,
                    endPage,
                    listCount: response.data.search.listCount,
                }));


            } catch (error) {
                console.error('handleBookView Error:', error);
            }
        };

        loadBooks();
    }, [pagingInfo.pageNumber, pagingInfo.action]);

    const handlePageChange = async (page) => {
        const pageNumber = page || 1; // page 값이 없을 경우 기본값으로 1 설정
        //console.log("Current Page:", currentPage);
        console.log("핸들인풋체인지");
        setPagingInfo((prev) => ({
            ...prev,
            pageNumber: page, // 선택된 페이지 번호로 업데이트
        }));

        handleBookView(pageNumber, pagingInfo.action);
    };

    //페이지 불러오기
    const handleBookView = async (page, action) => {
        const groupSize = 8; // 그룹 크기 정의
        console.log("핸들 북 뷰");
        try {
            const params = {
                ...pagingInfo,
                pageNumber: page,
                action: action,
                keyword: pagingInfo.keyword,
            };

            let response = await apiSpringBoot.get(`/book`, params);


            setBooks(response.data.list);
            console.log("API Response:", response.data.list);

            //페이지 계산
            const { maxPage, startPage, endPage } = PagingDiv8Calculate(response.data.search.pageNumber,
                response.data.search.listCount, response.data.search.pageSize, groupSize);
            console.log("Paging Calculation:", { maxPage, startPage, endPage });

            setPagingInfo((prev) => ({
                ...prev,
                maxPage: maxPage,
                startPage: startPage,
                endPage: endPage,
                startDate: formatDate(response.data.search.startDate),
                endDate: formatDate(response.data.search.endDate),
            }));

        } catch (error) {
            console.log('handleBookView Error : {}', error);
        }
    };

    //input 에 입력 시 paging훅에 저장
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("핸들인풋체인지");
        setPagingInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //검색 버튼 클릭
    const handleSearchClick = () => {
        handleBookView(1, pagingInfo.action);
        console.log("핸들서치클릭");
    };

    const renderSearchInputs = () => {
        //Enter 누르면 검색 버튼 클릭됨
        const handleKeyPress = (e) => {
            if (e.key === "Enter") {
                handleSearchClick();
            }
        };
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
        
    };

    //--------------------------------------------------
    if (role === "SENIOR") {
        return (
            <div className={styles.snrBkContainer}>
                <SeniorNavbar />

                <section className={styles.snrBkSection}>
                    <div className={styles.snrBkLeft}>
                        <div className={styles.snrBkLTop}>
                            <p>{formattedToday}</p>
                            <h1>오늘의<br />어르신 프로그램</h1>
                        </div>{/* snrBkLTop end */}
                    </div>{/* snrBkLeft end */}

                    <div className={styles.snrBkRight}>
                        <div className={[styles.snrBkList, 'masked-overflow'].join(' ')}
                            style={{ height: '90%' }}>
                            {(books || []).map((book) => {

                                return (
                                    <div className={styles.snrBkListItem} key={book.bookNum}>
                                        <a onClick={() => handleMoveDetailView(book.bookNum)}>
                                            <h1>{book.bookTitle}</h1>
                                            <span>내용이 궁금하면 클릭해보세요!</span>
                                        </a>
                                    </div>
                                );
                            })}

                            <button type="button" className={styles.bkListBtn} onClick={()=>(window.location.href ="/book")}>목록</button>

                            <PagingDiv8
                                pageNumber={pagingInfo.pageNumber || 1}
                                pageSize={pagingInfo.pageSize || 8}
                                maxPage={pagingInfo.maxPage || 1}
                                startPage={pagingInfo.startPage || 1}
                                endPage={pagingInfo.endPage || 1}
                                onPageChange={(page) => {
                                    console.log("Page change triggered:", page);
                                    handlePageChange(page);
                                }}
                            />
                        </div>{/* snrBkList end */}

                    </div>{/* snrBkRight end */}
                </section>{/* snrBkSection end */}

                <SeniorFooter />
            </div>//snrBkContainer end
        );
    } else if(role === "MANAGER") {
        return (
            <div className={styles.bkContainer}>
                <SideBar />
                <section className={styles.bkRSection}>
                    <div className={styles.secTop}>
                        <p>책</p>
                    </div>{/* .secTop end */}

                    <div className={styles.secContent}>
                        <div className={styles.bkListTop}>
                            <p className={styles.bkTitle}>책 목록 <span>{pagingInfo.listCount}</span></p>
                            <div className={styles.bkTopBtns}>
                                <button type="button" onClick={()=>(window.location.href ="/book")}>목록</button>
                                {(role === "MANAGER" || role === "ADMIN") && (
                                    <button type="button" onClick={handleWriteClick}>등록하기</button>
                                )}
                            </div>


                            <div className={styles.bkSearchWrap}>
                                {renderSearchInputs()}

                                <button type="button" onClick={handleSearchClick} className={styles.searchButton}>검색</button>
                            </div>{/* bkSearchWrap end */}
                        </div>{/* bkListTop end */}

                        <div className={styles.bkListWrap}>
                            <ul className={styles.bkList}>
                                {(books || []).map((book) => {
                                    //image MIME 타입 필터링 후 첫 번째 파일 가져오기
                                    // const firstImageFile = book && book.fileContent;
                                    // const firstImageUrl = firstImageFile ? `data:${firstImageFile.mimeType};base64,${firstImageFile.fileContent}` : bkImage;

                                    return (
                                        <li key={book.book.bookNum} className={styles.bkListItem}>
                                            <a onClick={() => handleMoveDetailView(book.book.bookNum)}>
                                                <div className={styles.bkListImgWrap}>
                                                    <img src={`data:${book.mimeType};base64,${book.fileContent}`} className={styles.bkImage} />
                                                </div>
                                                <div className={styles.bkListTextWrap}>
                                                    <p>{book.book.bookTitle}</p>
                                                </div>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>{/* bkList end */}
                        </div>{/* bkListWrap end */}
                    </div>{/* secContent end */}

                    <PagingDiv8
                        pageNumber={pagingInfo.pageNumber || 1}
                        pageSize={pagingInfo.pageSize}
                        maxPage={pagingInfo.maxPage || 1}
                        startPage={pagingInfo.startPage || 1}
                        endPage={pagingInfo.endPage || 1}
                        onPageChange={(page) => {
                            console.log("Page change triggered:", page);
                            handlePageChange(page);
                        }}
                    />
                </section>{/* bkRSection end */}
            </div>
        );
    }// else end
};

export default BookList;