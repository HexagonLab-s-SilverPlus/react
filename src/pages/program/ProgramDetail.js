// src/pages/program/ProgamDetail.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { apiSpringBoot } from "../../utils/axios";
import { AuthContext } from "../../AuthProvider";
import styles from './ProgramDetail.module.css';
import SideBar from "../../components/common/SideBar";

import SeniorNavbar from "../../components/common/SeniorNavbar";
import SeniorFooter from "../../components/common/SeniorFooter";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const ProgramDetail = () => {
    //이동
    const navigate = useNavigate();
    const location = useLocation();

    //토큰정보 가져오기(AuthProvider)
    const { role, member } = useContext(AuthContext);

    const [program, setProgram] = useState({
        snrStartedAt: '',
        snrEndedAt: '',
    });
    const [files, setFiles] = useState([]);
    const { snrProgramId } = useParams();   //URL 파라미터에서 ID 가져오기

    //목록 페이지로 이동
    const handleMoveProgram = () => {
        const { isNearby } = location.state || {}; // location.state에서 isNearby 가져오기

        const initialPagingInfo = {
            pageNumber: 1,
            listCount: 1,
            pageSize: 8,
            maxPage: 1,
            startPage: 1,
            endPage: 1,
            action: 'all', // 기본 검색 조건
            keyword: '',
            startDate: new Date().toISOString().split('T')[0], // 오늘 날짜
            endDate: new Date().toISOString().split('T')[0],
        };

        if (role === "SENIOR") {
            // isNearby 상태를 고려하여 이동
            navigate(`/program`, {
                state: {
                    pagingInfo: initialPagingInfo,
                    isNearby: isNearby || false, // 기본값으로 false 설정
                },
            });
        } else {
            // SENIOR가 아닌 경우 초기 상태로 이동
            navigate(`/program`);
        }
    };


    //이전 페이지로 이동
    const handleMovePrevPage = () => {
        if (role === "SENIOR") {
            const { pagingInfo, isNearby } = location.state || {};
            navigate(`/program`, { state: { pagingInfo, isNearby } });
        } else {
            navigate(`/program`); // SENIOR가 아닌 경우 상태 전달 없이 이동
        }
    };

    //수정 페이지로 이동
    const handleUpdateProgram = () => {
        navigate(`/program/update/${snrProgramId}`)
    };

    const formatDate = (w) => {     // 데이터 포멧(우리나라 시간으로)
        const date = new Date(w);

        // 연도에서 앞 2자리를 제거하고, 초는 제외한 형식으로 출력
        const year = date.getFullYear();
        const month = date.getMonth() + 1;  // 월은 0부터 시작하므로 1을 더해야 합니다.
        const day = date.getDate();

        return `${year}-${month}-${day}`;
    };

    //URL에 하이퍼링크 적용
    const renderContentWithLinks = (content) => {
        if (!content) {
            return '내용 없음';
        }

        // 정규식으로 URL 감지
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        // 텍스트를 URL과 일반 텍스트로 분리
        const parts = content.split(urlRegex);

        // URL은 <a> 태그로 감싸고 나머지는 그대로 출력
        return parts.map((part, index) =>
            urlRegex.test(part) ? (
                <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'blue', textDecoration: 'underline' }}
                >
                    {part}
                </a>
            ) : (
                part
            )
        );
    };

    //디테일 페이지 불러오기
    const handleProgramDetailView = async () => {
        try {
            const response = await apiSpringBoot.get(`/program/detail/${snrProgramId}`);
            // console.log('API Response:', response.data);
            setProgram(response.data.program);
            setFiles(response.data.files || []);
        } catch (error) {
            // console.error('프로그램 목록 불러오기 실패 : ', error);
            alert('프로그램 상세보기 페이지를 불러오는데 실패하였습니다.');
        }
    };

    // 이미지 렌더링
    const renderImages = () => {
        const imageSlides = files
            .filter(file => file.mimeType.startsWith('image/')) // 이미지 파일 필터링
            .map((file, index) => (
                <SwiperSlide key={index} className={styles.pgSlide}>
                    <img
                        src={`data:${file.mimeType};base64,${file.fileContent}`}
                        alt={file.fileName}
                        className={styles.pgDetailImage}
                    />
                </SwiperSlide>
            ));
        return imageSlides.length > 0 ? imageSlides : null; // 이미지가 없으면 null 반환
    };

    // 첨부파일 렌더링 (다운로드 링크)
    const renderAttachments = () => {
        return files.map((file, index) => (
            <li key={index}>
                <a
                    href={`data:${file.mimeType};base64,${file.fileContent}`}
                    download={file.fileName}
                >
                    {file.fileName}
                </a>
            </li>
        ));
    };

    useEffect(() => {
        handleProgramDetailView();
    }, []);

    //삭제 버튼 클릭 핸들러
    const handleDeleteProgram = async () => {
        const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
        if (confirmDelete) {
            try {
                await apiSpringBoot.delete(`/program/${snrProgramId}`);
                alert("프로그램이 삭제되었습니다.");
                navigate(`/program`); // 삭제 후 목록 페이지로 이동
            } catch (error) {
                // console.error("프로그램 삭제 실패 : ", error);
                alert("프로그램 삭제에 실패하였습니다. 관리자에게 문의하세요.");
            }
        }
    };

    //--------------------------------------------------
    if (role === "SENIOR") {
        return (
            <div className={styles.snrPgContainer}>
                <SeniorNavbar />

                <div className={styles.pgSub}>
                    <div className={styles.pgSubTop}>
                        <div className={styles.pgSubTopBtns}>
                            <button onClick={handleMovePrevPage}>
                                <span className="material-symbols-outlined">arrow_left_alt</span>
                                뒤로 가기
                            </button>
                            <button onClick={handleMoveProgram}>목록</button>
                        </div>{/* pgSubTopBtns end */}

                        <div className={styles.pgSubTopWrap}>
                            <h1>{program.snrTitle}</h1>
                            <p><span>기관명</span>{program.snrOrgName}</p>
                            <p><span>기관 전화번호</span>{program.snrOrgPhone}</p>
                            <p><span>기관 주소</span>{program.snrOrgAddress}</p>
                            <p><span>참여 기간</span>{program.snrStartedAt.split('T')[0]} &nbsp; ~ &nbsp; {program.snrEndedAt.split('T')[0]}</p>
                        </div>{/* pgSubTopWrap end */}
                    </div>{/* snrPgSubTop end */}

                    <div className={styles.pgSubBottom}>
                        <div className={styles.pgSubContent} id="read">
                            {renderContentWithLinks(program.snrContent)}
                        </div>{/* pgSubInfo end */}

                        <div className={styles.pgImages}>
                            {files.some(file => file.mimeType.startsWith('image/')) && ( // 이미지가 있을 때만 Swiper 렌더링
                                <Swiper
                                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                                    spaceBetween={20}
                                    slidesPerView={1}
                                    navigation
                                    pagination={{ clickable: true }}
                                    scrollbar={{ draggable: true }}
                                    className={styles.pgSwiper}
                                    style={{
                                        "--swiper-pagination-color": "#064420",
                                        "--swiper-navigation-color": "#064420",
                                    }}
                                >
                                    {renderImages()}
                                </Swiper>
                            )}
                        </div>{/* .pgSubBottom > .pgImages end */}

                        <div className={styles.pgAttach}>
                            <span className={styles.pgAttachIcon}>첨부파일을 클릭하여 확인해보세요</span>
                            <ul className={styles.pgAttachList}>{renderAttachments()}</ul>{/* pgAttachList end */}
                        </div>{/* pgAttach end */}
                    </div>{/* snrPgSubBottom */}
                </div>{/* snrPgSubCon end */}

                <div className={styles.snrPgBottom}>
                    <button onClick={() => (
                        window.scrollTo(
                            { top: 0, behavior: 'smooth', }
                        )
                    )}>
                        <span className="material-symbols-outlined">arrow_upward</span>
                        위로 이동
                    </button>
                    <button onClick={handleMoveProgram}>목록</button>
                </div>{/* snrPgBottom end */}

                <SeniorFooter />
            </div>
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
                        <div className={styles.pgDetailTop}>
                            <h1 className={styles.pgDTitle}>{program.snrTitle}</h1>

                            <ul className={styles.pgDList}>
                                <li className={styles.pgDItem}>
                                    <span className="material-symbols-outlined">home</span>
                                    <span>기관명</span>
                                    <span>{program.snrOrgName}</span>
                                </li>
                                <li className={styles.pgDItem}>
                                    <span className="material-symbols-outlined">call</span>
                                    <span>기관 전화번호</span>
                                    <span>{program.snrOrgPhone}</span>
                                </li>
                                <li className={styles.pgDItem}>
                                    <span className="material-symbols-outlined">pin_drop</span>
                                    <span>기관 주소</span>
                                    <span>{program.snrOrgAddress}</span>
                                </li>
                                <li className={styles.pgDItem}>
                                    <span className="material-symbols-outlined">manage_accounts</span>
                                    <span>담당자명</span>
                                    <span>{program.snrMgrName}</span>
                                </li>
                                <li className={styles.pgDItem}>
                                    <span className="material-symbols-outlined">mail</span>
                                    <span>담당자 이메일</span>
                                    <span>{program.snrMgrEmail}</span>
                                </li>
                                <li className={styles.pgDItem}>
                                    <span className="material-symbols-outlined">calendar_month</span>
                                    <span>참여기간</span>
                                    <span>{formatDate(program.snrStartedAt)} ~ {formatDate(program.snrEndedAt)}</span>
                                </li>
                            </ul>

                            <div className={styles.pgDContent}>
                                <p className={styles.pgDTxt}>
                                    {renderContentWithLinks(program.snrContent)}</p>
                                <div className={styles.pgImages}>
                                    {files.some(file => file.mimeType.startsWith('image/')) && ( // 이미지가 있을 때만 Swiper 렌더링
                                        <Swiper
                                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                                            spaceBetween={20}
                                            slidesPerView={1}
                                            navigation
                                            pagination={{ clickable: true }}
                                            scrollbar={{ draggable: true }}
                                            className={styles.pgSwiper}
                                            style={{
                                                "--swiper-pagination-color": "#064420",
                                                "--swiper-navigation-color": "#064420",
                                            }}
                                        >
                                            {renderImages()}
                                        </Swiper>
                                    )}
                                </div>
                            </div>{/* .pgContent end */}

                            <div className={styles.pgAttach}>
                                <span className={styles.pgAttachIcon}>첨부파일</span>
                                <ul className={styles.pgAttachList}>{renderAttachments()}</ul>{/* pgAttachList end */}
                            </div>{/* pgAttach end */}
                        </div>{/* .pgDetailTop end */}

                        <div className={styles.pgDetailBottom}>
                            <button onClick={handleMoveProgram}>목록</button>
                            {(program.snrCreatedBy === member.memUUID) && (
                                <>
                                    <button onClick={handleUpdateProgram}>수정</button>
                                    <button onClick={handleDeleteProgram}>삭제</button>
                                </>
                            )}
                        </div>{/* .pgDetailBottom end */}
                    </div>{/* .secContent end */}
                </section>{/* .pgRSection end */}
            </div>
        );
    }//if (role === "SENIOR") else end
};

export default ProgramDetail;