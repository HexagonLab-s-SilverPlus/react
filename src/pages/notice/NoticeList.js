// src/pages/notice/NoticeList.js
import React,{useState,useEffect, useContext} from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
// AuthContext
import {AuthContext} from "../../AuthProvider"
// axios
import {apiSpringBoot} from '../../utils/axios';
// components
import SeniorNavbar from '../../components/common/SeniorNavbar';
import SeniorFooter from '../../components/common/SeniorFooter';
import SideBar from '../../components/common/SideBar';
import Paging from '../../components/common/Paging';
import { PagingCalculate } from '../../components/common/PagingCalculate ';
// css
import styles from './NoticeList.module.css'
// 이미지
import searchIcon from '../../assets/images/search.png'
import up from '../../assets/images/keyboard_arrow_up.png'
import down from '../../assets/images/keyboard_arrow_down.png'

function NoticeList() {
    // 공지사항 리스트
    const [notices, setNotices] = useState([]);
    // 페이징 정보
    const [pagingInfo, setPagingInfo] = useState({
        pageNumber:1,
        pageSize:10,
        maxPage:1,
        startPage:1,
        endPage:1,
        listCount:1,
    });
    // 검색 정보
    const [search, setSearch] = useState({
        action:"제목",
        keyword:"",
    });

    // navigate 객체생성
    const navigate = useNavigate();

    // 토큰정보 가져오기(AuthProvider)
    const {role} = useContext(AuthContext);  // 롤정보    

    // 검색관련
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 상태
    // 키워드 임시저장장
    const [tempKeyword, setTempKeyword] = useState(""); // 입력 중인 키워드



    // 핸들러
    // 드롭다운 토글처리
    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);  // 드롭다운 열기 / 닫기
    };
    // 검색 action 저장
    const handleSelectOption = (option) => {
        //setSelectOption(option);
        setSearch((prev)=>({
            ...prev,
            action:option,
        })); // 선택된 옵션 업데이트
        setIsDropdownOpen(false); // 드롭다운 닫기
    };
    // 키워드 입력
    const handleChangeKeyword = (e) => {
        setTempKeyword(e.target.value);
    };

    // 키워드검색
    const handleSearch = ()=>{
        const updatedSearch = {
            ...search,
            keyword:tempKeyword,
        }
        setSearch(updatedSearch); // 상태 업데이트
        setPagingInfo((prev)=>({
            ...prev,
            pageNumber:1,
        }));
        handleUpdateView(1,updatedSearch);
    };

    // 페이징 변경시
    const handleUpdateView = async (page,updatedSearch = search) => {
        console.log(pagingInfo);
        console.log(search);
        try{
            const response = await apiSpringBoot.get(`/notice`, {
                params: {
                    ...pagingInfo,
                    pageNumber:page,
                    ...updatedSearch,
                },
            });
            setPagingInfo(PagingCalculate(page,response.data.search.listCount,response.data.search.pageSize));
            setPagingInfo((prev) =>({
                ...prev,
                pageNumber:page,
                listCount:response.data.search.listCount,
                pageSize:response.data.search.pageSize,
            }));   
            setNotices(response.data.list);
            console.log("notices : "+response.data.list);         
        } catch (e){
            console.log("error : {}", e); // 에러 메시지 설정
        }    
    };


    // 최초 공지사항 전체리스트 가져오기
    useEffect(()=>{
        const fetchNotices = async () => {
        try{
            //console.log(response.data.search.pageNumber);
            const response = await apiSpringBoot.get('/notice');
            console.log(response.data.list);
            console.log(response.data.search);
            // 리스트저장
            setNotices(response.data.list);
            // 페이징 처리할 값 생성
            setPagingInfo(PagingCalculate(response.data.search.pageNumber,response.data.search.listCount, response.data.search.pageSize));
            setPagingInfo((prev) =>({
                ...prev,
                pageNumber:response.data.search.pageNumber,
                listCount:response.data.search.listCount,
                pageSize:response.data.search.pageSize,
            }));
            console.log(response.data.search.pageNumber);
        } catch (error) {
            console.log(error);
            alert("공지사항 불러오기에 실패하였습니다.");
        }
    };
    fetchNotices();
    },[]);


    // 랜더링 뷰
    if (role === "SENIOR"){
        return (
            <div className={styles.noticeList}>
                {/* 헤더 */}
                <SeniorNavbar/>
                <div className={styles.top}>
                    <div className={styles.menuName} onClick={()=>(navigate('/notice'))}>공지사항</div>
                    {/* 검색창 */}
                    <div className={styles.searchbox}>
                        {/* 검색옵션 */}
                        <div 
                            className={styles.searchOptions}
                            onClick={handleToggleDropdown}
                        >
                            &nbsp; {search.action} &nbsp;
                            <img
                                className={styles.arrow}
                                src={isDropdownOpen ? up:down}
                                alt={isDropdownOpen ? "올리기":"내리기"}
                            />&nbsp;
                        </div>
                        {isDropdownOpen && (
                            <div className={styles.dropdown}>
                                <div
                                    className={styles.dropdownOption}
                                    onClick={()=>handleSelectOption("제목")}
                                >
                                    &nbsp; 제목 &nbsp;
                                </div>
                                <div
                                    className={styles.dropdownOption}
                                    onClick={()=>handleSelectOption("내용")}
                                >
                                    &nbsp; 내용 &nbsp;
                                </div>
                            </div>
                        )}
                        {/* 검색키워드입력창 */}
                        <div className={styles.searchKeyword}>
                            &nbsp;
                            <input
                                className={styles.searchKeywordBox}
                                placeholder="검색어를 입력하세요."
                                value={tempKeyword}
                                onChange={handleChangeKeyword}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleSearch(); // Enter 키로 검색 실행
                                      setIsDropdownOpen(false);
                                    }
                                  }}
                            />
                            &nbsp;
                            <img
                                className={styles.search}
                                src={searchIcon}
                                alt="검색"
                                onClick={() => {
                                    handleSearch();
                                    setIsDropdownOpen(false);
                                }}
                            />
                            &nbsp;
                        </div>
                    </div>
                </div>

                {/* 리스트 출력 */}
                <div className={styles.list}>
                {notices.map((noticeList) =>(
                    <div
                        key={noticeList.notId}
                        onClick={()=>(navigate(`/noticedetail/${noticeList.notId}`))}
                        className={styles.object}
                    >
                        <div className={styles.title}>
                            {noticeList.notTitle}
                        </div>
                        <div className={styles.message}>
                            <div >
                                내용이 궁금하면 클릭해보세요!
                            </div>
                            <div className={styles.message}>
                                <div className={styles.date}>
                                    등록일 &nbsp;
                                    {noticeList.notCreateAt.split('T')[0]}
                                </div> &nbsp;&nbsp;&nbsp;
                                <div className={styles.date}>
                                    조회수 &nbsp;
                                    {noticeList.notReadCount}
                                </div>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                <div className={styles.noticePaging}>
                        <Paging 
                            currentPag={pagingInfo.pageNumber || 1}
                            maxPage={pagingInfo.maxPage || 1}
                            startPage={pagingInfo.startPage || 1}
                            endPage={pagingInfo.endPage || 1}
                            onPageChange={(page) => handleUpdateView(page)}
                        />
                    </div>

                {/*Footer*/}
                <SeniorFooter />
            </div>
        );
    } else {
        console.log('렌더링 직전 데이터 notices : '+notices);
        console.log('렌더링 직전 데이터 pagingInfo : '+pagingInfo);
        console.log('렌더링 직전 데이터 search : '+search.action+ ' ' + search.keyword);
        return (
            <div className={styles.memberContainer}>
                <SideBar />
                <div className={styles.memberSubContainer}>
                    <div className={styles.MemberNoticeTop}>
                        <p onClick={()=>(navigate("/notice"))}>공지사항</p>
                    </div>
                    <div className={styles.memberSubLine}>
                        {role ==="ADMIN"&&(
                        <div>
                            <button className={styles.memberInputButton} onClick={()=>(navigate("/noticewrite"))}>공지사항 등록</button>
                        </div>)
                        }
                        {role !=="ADMIN"&&(
                        <div>
                        </div>)
                        }
                        <div className={styles.memberSearchbox}>
                            <div 
                                className={styles.memberSearchOptions}
                                onClick={handleToggleDropdown}
                            >
                                &nbsp; {search.action} &nbsp;
                                <img
                                    className={styles.memberArrow}
                                    src={isDropdownOpen ? up:down}
                                    alt={isDropdownOpen ? "올리기":"내리기"}
                                />&nbsp;
                            {isDropdownOpen && (
                                <div className={styles.memberDropdown}>
                                    <div
                                        className={styles.memberDropdownOption}
                                        onClick={()=>handleSelectOption("제목")}
                                        >
                                        &nbsp; 제목 &nbsp;
                                    </div>
                                    <div
                                        className={styles.memberDropdownOption}
                                        onClick={()=>handleSelectOption("내용")}
                                        >
                                        &nbsp; 내용 &nbsp;
                                    </div>
                                </div>
                            )}
                            </div>
                            {/* 검색키워드입력창 */}
                            <div className={styles.memberSearchKeyword}>
                                &nbsp;
                                <input
                                    className={styles.memberSearchKeywordBox}
                                    placeholder="검색어를 입력하세요."
                                    onChange={handleChangeKeyword}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleSearch(); // Enter 키로 검색 실행
                                          setIsDropdownOpen(false);
                                        }
                                      }}
                                    value={tempKeyword}  
                                />
                                &nbsp;
                                <img
                                    className={styles.memberSearch}
                                    src={searchIcon}
                                    alt="검색"
                                    onClick={() => {
                                        handleSearch();
                                        setIsDropdownOpen(false);
                                    }}
                                />
                                &nbsp;
                            </div>
                        </div>
                    </div>
                    <div className={styles.tableDiv}>
                        <table className={styles.memberNoticeTable}>
                            <thead>
                                <tr>
                                    <th className={styles.thTitle}>제목</th>
                                    <th className={styles.thDate}>등록일</th>
                                    <th className={styles.thViews}>조회수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notices.map((noticeList) =>(
                                    <tr 
                                        key={noticeList.notId}
                                        onClick={()=>(navigate(`/noticedetail/${noticeList.notId}`))}
                                    >
                                        <td>{noticeList.notTitle}</td>
                                        <td>{noticeList.notCreateAt.split('T')[0]}</td>
                                        <td>{noticeList.notReadCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.memberNoticePaging}>
                        <Paging 
                            currentPag={pagingInfo.pageNumber || 1}
                            maxPage={pagingInfo.maxPage || 1}
                            startPage={pagingInfo.startPage || 1}
                            endPage={pagingInfo.endPage || 1}
                            onPageChange={(page) => handleUpdateView(page)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default NoticeList;