// src/pages/book/BookList.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { apiSpringBoot } from "../../utils/axios";
import { AuthContext } from "../../AuthProvider";
import styles from './BookList.module.css';
import SideBar from "../../components/common/SideBar";
import PagingDiv8 from '../../components/common/PagingDiv8';
import { PagingDiv8Calculate } from "../../components/common/PagingDiv8Calculate";

import SeniorNavbar from "../../components/common/SeniorNavbar";
import SeniorFooter from "../../components/common/SeniorFooter";

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [playbutton, setPlaybutton] = useState(true);
    const [playAudio, setPlayAudio] = useState(null);

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
    });

    const [tempKeyword, setTempKeyword] = useState('');
    
    const navigate = useNavigate();
    // 인증 정보와 flask API URL 가져오기
    const { apiFlask } = useContext(AuthContext);
    //토큰정보 가져오기(AuthProvider)
    const { role } = useContext(AuthContext);

    //등록하기 페이지로 이동 핸들러
    const handleWriteClick = () => {
        navigate('/book/write');
    };


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
                    },
                });

                // books에 isPlaying 추가
                const updateBooks = response.data.fileList.map((book)=>({
                    ...book,
                    isPlaying:false,// 초기 상태는 재생중 아님
                }));

                console.log("book",response.data.fileList.book);
                setBooks(updateBooks);
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
    }, [pagingInfo.pageNumber,pagingInfo.keyword]);

    const handlePageChange = async (page) => {
        //const pageNumber = page || 1; // page 값이 없을 경우 기본값으로 1 설정
        //console.log("Current Page:", currentPage);
        console.log("핸들인풋체인지");
        setPagingInfo((prev) => ({
            ...prev,
            pageNumber: page, // 선택된 페이지 번호로 업데이트
        }));
        // handleBookView(pageNumber, pagingInfo.action);
    };

    //페이지 불러오기
    // const handleBookView = async (page, action) => {
    //     const groupSize = 8; // 그룹 크기 정의
    //     console.log("핸들 북 뷰");
    //     try {
    //         const params = {
    //             ...pagingInfo,
    //             pageNumber: page,
    //             action: action,
    //             keyword: pagingInfo.keyword,
    //         };

    //         let response = await apiSpringBoot.get(`/book`, params);


    //         setBooks(response.data.list);
    //         console.log("API Response:", response.data.list);

    //         //페이지 계산
    //         const { maxPage, startPage, endPage } = PagingDiv8Calculate(response.data.search.pageNumber,
    //             response.data.search.listCount, response.data.search.pageSize, groupSize);
    //         console.log("Paging Calculation:", { maxPage, startPage, endPage });

    //         setPagingInfo((prev) => ({
    //             ...prev,
    //             maxPage: maxPage,
    //             startPage: startPage,
    //             endPage: endPage,
    //         }));

    //     } catch (error) {
    //         console.log('handleBookView Error : {}', error);
    //     }
    // };

    //input 에 입력 시 paging훅에 저장
    const handleInputChange = (e) => {
        console.log("핸들인풋체인지");
        setTempKeyword(e.target.value);
    };

    //검색 버튼 클릭
    const handleSearchClick = () => {
        setPagingInfo((prev)=>({
            ...prev,
            pageNumber:1,
            keyword:tempKeyword,

        }));
        console.log("핸들서치클릭");
    };
    
    const handlePlayRecord = async (text,bookIndex) =>{
        console.log(`playing text for book ${bookIndex}:${text}`);
        alert("잠시만 기다려주세요.");

        try{
            // 2. TTS API 호출

            const response = await apiFlask.post('/tts/pagereader', { text }, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.status===200){
                // 3. 음성 재생
                const audioUrl = URL.createObjectURL(response.data);//Blob -> URL변환
                const newAudio = new Audio(audioUrl);
                newAudio.play();

                // 특정 책의 isPlaying 상태를 true로 설정
                setBooks((prevBooks) =>
                    prevBooks.map((book, index) =>
                        index === bookIndex ? { ...book, isPlaying: true } : book
                    )
                );

                // 재생이 끝나면 상태 초기화
                newAudio.onended = () => {
                    setBooks((prevBooks) =>
                        prevBooks.map((book, index) =>
                            index === bookIndex ? { ...book, isPlaying: false } : book
                        )
                    );
                    setPlayAudio(null);
                };
                setPlayAudio(newAudio);

                // // 정지 버튼을 누르거나 오디오가 끝나면 상태 초기화
                // newAudio.onended = () => {
                //     setPlaybutton(true);
                //     setPlayAudio(null);
                // };
            } else {
                console.log("음성변환에 실패하였습니다. 다시 시도해주세요.");
                alert("음성변환에 실패하였습니다. 다시 시도해주세요.");
            }
        } catch(error){
            console.error("TTS 요청중 오류 : ", error);
            alert("음성변환에 실패하였습니다. 다시 시도해주세요.")
        }
    };

    const handleStopRecord = (bookIndex) => {
        if (playAudio) {
            playAudio.pause();
            playAudio.currentTime=0;
            // 특정 책의 isPlaying 상태를 false로 설정
            setBooks((prevBooks) =>
                prevBooks.map((book, index) =>
                    index === bookIndex ? { ...book, isPlaying: false } : book
                )
            );

            setPlayAudio(null);
        }
    };

    // 페이지 이동 시 TTS 중지
    useEffect(() => {
        const handleBeforeUnload = () => {
            // if (audio) {
            //     audio.pause();
            //     audio.currentTime = 0; // 오디오 재생 초기화
            // }
        };

        // 이벤트 리스너 등록
        window.addEventListener("beforeunload", handleBeforeUnload);

        // 페이지 이동 시 URL 변경 감지
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;

        window.history.pushState = function (...args) {
            handleBeforeUnload();
            originalPushState.apply(window.history, args);
        };

        window.history.replaceState = function (...args) {
            handleBeforeUnload();
            originalReplaceState.apply(window.history, args);
        };

        return () => {
            // 이벤트 리스너 제거
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
        };
    }, [playAudio]);


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
                placeholder="검색어를 입력하세요."
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
            />
        );
        
    };

    // if (!audio) {
    //     // 데이터가 없을 경우 로딩 상태나 다른 처리를 할 수 있도록 추가
    //     return <div>Loading...</div>;
    // };

    console.log(tempKeyword);
    //--------------------------------------------------
    if (role === "SENIOR") {
        return (
            <div className={styles.snrBkContainer}>
                <SeniorNavbar />

                <section className={styles.snrBkSection}>
                    <div className={styles.snrBkLeft}>
                        <div className={styles.snrBkLTop}>
                            <h1>전자책</h1>
                        </div>{/* snrBkLTop end */}
                    </div>{/* snrBkLeft end */}

                    <div className={styles.snrBkRight}>
                        <div className={styles.bkSearchWrap}>
                            {renderSearchInputs()}

                            <button type="button" onClick={handleSearchClick} className={styles.searchButton}>검색</button>
                        </div>{/* bkSearchWrap end */}
                        <div className={styles.snrBkList}>
                                <ul className={styles.pgBookList}>
                                    {(books || []).map((book,index) => (
                                            <li className={styles.pgBookItem} key={book.book.bookNum}>
                                                <div>
                                                    <div>
                                                        <img src={`data:${book.mimeType};base64,${book.fileContent}`} className={styles.pgBookImage}/>
                                                    </div>
                                                    <div className={styles.pgBookTextWrap}>
                                                        <div className={styles.pgBookTitleWrap}>{book.book.bookTitle}</div>
                                                    </div>
                                                    <div>
                                                        {book.isPlaying ?(
                                                        <button className={styles.pgBookbuttonStop} onClick={() => handleStopRecord(index)}>정지</button>
                                                        ):(
                                                        <button className={styles.pgBookbutton} onClick={() => handlePlayRecord(book.textContexnt,index)}>재생</button>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                    ))}
                                </ul>
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
                            <div className={styles.marginBotton} />
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