// // src/pages/program/ProgramList.jsx
// import React, { useState, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { apiSpringBoot } from "../../utils/axios";
// import styles from './ProgramList.module.css';
// import SideBar from '../../components/common/SideBar';
// import PagingDiv8 from '../../components/common/PagingDiv8';
// import { PagingDiv8Calculate } from '../../components/common/PagingDiv8Calculate';
// import pgImage from '../../assets/images/pgImage.png';

// const ProgramList = () => {
//     const [programs, setPrograms] = useState([]);
//     const [actionInfo, setActionInfo] = useState([]);

//     const [pagingInfo, setPagingInfo] = useState({
//         pageNumber: 1,
//         listCount: 1,
//         pageSize: 8,
//         maxPage: 1,
//         startPage: 1,
//         endPage: 1,
//         action: 'all',
//         keyword: '',
//         startDate: '',
//         endDate: '',
//     });

//     const navigate = useNavigate();

//     //데이터 포맷(한국시간)
//     const formatDate = (w) => {
//         const date = new Date(w);

//         const year = date.getFullYear();
//         const month = date.getMonth() + 1;  //월은 0부터 시작하므로 1을 더해야 함
//         const day = date.getDate();

//         return `${year}-${month}-${day}`;
//     };

//     //페이지 클릭시 해당 페이지로 변경
//     const handlePageChange = async (page) => {
//         fetchProgram(page, pagingInfo.action);
//     };

//     //목록 불러오기
//     const fetchProgram = async (page, action) => {
//         try {
//             const response = await apiSpringBoot.get(`/program`, {
//                 params: {
//                     ...pagingInfo,
//                     pageNumber: page,
//                     action: action,
//                     keyword: pagingInfo.keyword,
//                     startDate: pagingInfo.startDate + " 00:00:00",
//                     endDate: pagingInfo.endDate + " 00:00:00",
//                 },
//             });
//             setPrograms(response.data.list);
            
//             const {maxPage, startPage, endPage} = PagingDiv8Calculate(
//                 response.data.search.pageNumber, response.data.search.listCount, response.data.search.pageSize);
            
//             setPagingInfo(response.data.search);
//             setPagingInfo((prev) => ({
//                 ...prev,
//                 maxPage: maxPage,
//                 startPage: startPage,
//                 endPage: endPage,
//                 startDate: formatDate(response.data.search.startDate),
//                 endDate: formatDate(response.data.search.endDate),
//             }));
//         } catch (error) {
//             console.log('fetchProgram Error : {}', error);
//             alert('어르신 프로그램 목록을 불러오는데 실패했습니다.');
//         }
//     };

//     //select 변경시 검색상태 저장
//     const handleSelectChange = (e) => {
//         const {value} = e.target;
//         setActionInfo(() => ({
//             ...prev,
//             actionType: value,
//         }));
//     };

//     //검색 데이터 입력시 paging 훅에 저장
//     const handleChange = (e) => {
//         const {value, name} = e.target;
//         setPagingInfo((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     //검색 버튼 클릭시 출력뷰 변경
//     const handleSearch = () => {
//         fetchProgram(1, actionInfo.actionType);
//     };

//     //actionType에 따라 검색바 변경
//     const renderSearchInputs = () => {
//         switch (actionInfo.actionType) {
//             case "pgDate":
//                 return (
//                     <div className={styles.pgDateWrap}>
//                         <input
//                             type="date"
//                             name="startDate"
//                             onChange={handleChange}
//                         />
//                         <span> ~ </span>
//                         <input
//                             type="date"
//                             name="endDate"
//                             onChange={handleChange}
//                         />
//                     </div>
//                 );
//             case "all":
//             default:
//                 return (
//                     <input
//                         type="search"
//                         name="keyword"
//                         placeholder="검색어를 입력하세요."
//                         onChange={handleChange}
//                         className={styles.searchInput}
//                     /> 
//                 );
//         }
//     };

//     useEffect(() => {
//         fetchProgram(pagingInfo.pageNumber, pagingInfo.action);
//     }, []);

//     //등록하기 버튼 클릭 시 이동
//     const handleWriteClick = () => {
//         navigate('/program/write');
//     };

//     //상세보기로 이동
//     const handleMoveDetail = (snrProgramId) => {
//       navigate(`/program/detail/${snrProgramId}`);  
//     };

//     return(
//         <div className={styles.pgContainer}>
//             <SideBar />
//             <section className={styles.pgRSection}>
//                 <div className={styles.secTop}>
//                     <p>어르신 프로그램</p>
//                 </div>{/* .secTop end */}

//                 <div className={styles.secContent}>
//                     <div className={styles.pgListTop}>
//                         <p className={styles.pgTitle}>어르신 프로그램 목록 <span>{pagingInfo.listCount}</span></p>
//                         <button type="button" onClick={handleWriteClick}>등록하기</button>

//                         <div className={styles.pgSearchWrap}>
//                             <select name='actionType' onChange={handleSelectChange} className={styles.searchSelect}>
//                                 <option value="all" selected>선택&nbsp;&nbsp;</option>
//                                 <option value="pgTitle">제목&nbsp;&nbsp;</option>
//                                 <option value="pgContent">내용&nbsp;&nbsp;</option>
//                                 <option value="pgArea">지역&nbsp;&nbsp;</option>
//                                 <option value="pgOrg">기관명&nbsp;&nbsp;</option>
//                                 <option value="pgDate">참여기간&nbsp;</option>
//                             </select>
                            
//                             {renderSearchInputs()}

//                             <button type="button" onClick={handleSearch} className={styles.searchButton}>검색</button>
//                         </div>{/* pgSearchWrap end */}
//                     </div>{/* pgListTop end */}
                    
//                     <div className={styles.pgListWrap}>
//                         <ul className={styles.pgList}>
//                             {programs.map((item) => {
//                                 const {program, pgfiles} = item;   //프로그램 데이터와 파일 URL 분리
                                
//                                 //image MIME 타입 필터링 후 첫 번째 파일 가져오기
//                                 const firstImageFile = pgfiles && pgfiles.find(file => file.mimeType.startsWith('image/'));
//                                 const firstImageUrl = firstImageFile ? `data:${firstImageFile.mimeType};base64,${firstImageFile.fileContent}` : pgImage;
                                
//                                 return(
//                                     <li key={program.snrProgramId} className={styles.pgListItem}>
//                                         <div className={styles.pgListImgWrap}>
//                                             <img src={firstImageUrl} className={styles.pgImage} />
//                                         </div>
//                                         <div className={styles.pgListTextWrap}>
//                                             <p><button onClick={() => handleMoveDetail(program.snrProgramId)}>{program.snrTitle}</button></p>
//                                             <p><span>기간 : </span>{program.snrStartedAt.split('T')[0]} ~ {program.snrEndedAt.split('T')[0]}</p>
//                                             <p><span>장소 : </span>{program.snrOrgName}</p>
//                                         </div>
//                                     </li>
//                                 );
//                             })}
//                         </ul>{/* pgList end */}
//                     </div>{/* pgListWrap end */}
//                 </div>{/* secContent end */}

//                 <PagingDiv8
//                     currentPage={pagingInfo.currentPage}
//                     maxPage={pagingInfo.maxPage}
//                     startPage={pagingInfo.startPage}
//                     endPage={pagingInfo.endPage}
//                     onPageChange={(page) => handlePageChange(page)}
//                 />
//             </section>{/* pgRSection end */}
//         </div>
//     );
// };

// export default ProgramList;

// src/pages/program/ProgramList.jsx
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiSpringBoot } from "../../utils/axios";
import styles from './ProgramList.module.css';
import SideBar from '../../components/common/SideBar';
import PagingDiv8 from '../../components/common/PagingDiv8';
import pgImage from '../../assets/images/pgImage.png';

const ProgramList = () => {
    const [programs, setPrograms] = useState([]);

    //검색
    const [selectedAction, setSelectedAction] = useState('all');

    //페이징
    const [pagingInfo, setPagingInfo] = useState({
        currentPage: 1,
        maxPage: 1,
        startPage: 1,
        endPage: 1,
        action: '',
        keyword: '',
        startDate: '',
        endDate: '',
    });

    const navigate = useNavigate();

    //program list
    const fetchPrograms = async (page, action) => {
        try {
            const response = await apiSpringBoot.get(`/program`, {
                params: {
                    page,
                    action: action || pagingInfo.action,
                    keyword: pagingInfo.keyword,
                    startDate: pagingInfo.startDate + " 00:00:00",
                    endDate: pagingInfo.endDate + " 00:00:00",
                },
            });
            setPrograms(response.data.list);
            setPagingInfo((prev) => ({
                ...prev,
                ...response.data.paging,
            }));
        } catch (error) {
            console.log("fetchPrograms Error : {}", error); // 에러 메시지 설정
            alert('어르신 프로그램 목록을 불러오는데 실패했습니다.');
        }
    };

    useEffect(() => {
        fetchPrograms(1, 'all');    //초기 데이터 로드
    }, []);

    const handlePageChange = async (page) => {
        fetchPrograms(page, pagingInfo.action);
    }

    //등록하기 페이지로 이동 핸들러
    const handleWriteClick = () => {
        navigate('/program/write');
    };

    //검색 옵션 변경 핸들러
    const handleActionChange = (e) => {
        setSelectedAction(e.target.value);
        setPagingInfo((prev) => ({
            ...prev,
            action: e.target.value,
        }));
    };

    //검색 데이터 작성 시 paging훅에 저장
    const handleSearchChange = (e) => {
        const {name, value} = e.target;
        setPagingInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //검색 버튼 클릭시 뷰 변경
    const handleSearchClick = () => {
        fetchPrograms(1, selectedAction);
    };

    const renderSearchInputs = () => {
        switch (selectedAction) {
            case "pgDate":
                return (
                    <div className={styles.pgDateWrap}>
                        <input
                            type="date"
                            name="startDate"
                            onChange={handleSearchChange}
                        />
                        <span> ~ </span>
                        <input
                            type="date"
                            name="endDate"
                            onChange={handleSearchChange}
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
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    /> 
                );
        }
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
                        <p className={styles.pgTitle}>어르신 프로그램 목록 <span>{pagingInfo.listCount}</span></p>
                        <button type="button" onClick={handleWriteClick}>등록하기</button>

                        <div className={styles.pgSearchWrap}>
                            <select value={selectedAction} onChange={handleActionChange} className={styles.searchSelect}>
                                <option>선택&nbsp;&nbsp;</option>
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
                            {programs.map((item) => {
                                const {program, pgfiles} = item;   //프로그램 데이터와 파일 URL 분리
                                
                                //image MIME 타입 필터링 후 첫 번째 파일 가져오기
                                const firstImageFile = pgfiles && pgfiles.find(file => file.mimeType.startsWith('image/'));
                                const firstImageUrl = firstImageFile ? `data:${firstImageFile.mimeType};base64,${firstImageFile.fileContent}` : pgImage;
                                
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

                <PagingDiv8
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