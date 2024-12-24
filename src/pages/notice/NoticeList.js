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
import search from '../../assets/images/search.png'
import up from '../../assets/images/keyboard_arrow_up.png'
import down from '../../assets/images/keyboard_arrow_down.png'

function NoticeList() {
    // 공지사항 리스트트
    const [notices, setNotices] = useState([]);
    // // 페이징 정보
    // const [pagingInfo, setPagingInfo] = useState({
    //     pageNumber:1,
    //     pageSize:1,
    //     maxPage:1,
    //     startPage:1,
    //     endPage:1,
    // });
    // // 검색 정보
    // const [search, setSearch] = useState({
    //     action:"",
    //     keyword:"",
    //     startDate:"",
    //     endDate:"",
    // });

    // navigate 객체생성
    const navigate = useNavigate();

    // 토큰정보 가져오기(AuthProvider)
    const {role} = useContext(AuthContext);  // 롤정보    

    // 검색관련
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 상태
    const [selectOption, setSelectOption] = useState("제목") ; // 선택된 옵션



    // 핸들러
    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);  // 드롭다운 열기 / 닫기
    };
    const handleSelectOption = (option) => {
        setSelectOption(option); // 선택된 옵션 업데이트
        setIsDropdownOpen(false); // 드롭다운 닫기
    };

    // 최초 공지사항 전체리스트 가져오기기
    useEffect( async () =>{
        try{
            const response = await apiSpringBoot.get('/notice');
            setNotices(response.data.list);
            console.log(response.data.list);
        } catch (error){
            console.log(error);
            alert("공지사항 불러오기에 실패하였습니다.");
        }
    },[]);
    



    // 랜더링 뷰
    if (role === "SENIOR"){
        return (
            <div className={styles.noticeList}>
                {/* 헤더 */}
                <SeniorNavbar/>
                <div className={styles.top}>
                    <div className={styles.menuName}>공지사항</div>
                    {/* 검색창 */}
                    <div className={styles.searchbox}>
                        {/* 검색옵션 */}
                        <div 
                            className={styles.searchOptions}
                            onClick={handleToggleDropdown}
                        >
                            &nbsp; {selectOption} &nbsp;
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
                            />
                            &nbsp;
                            <img
                                className={styles.search}
                                src={search}
                                alt="검색"
                            />
                            &nbsp;
                        </div>
                    </div>
                </div>

                {/* 리스트 출력 */}
                <div className={styles.list}>
                    <div
                        className={styles.object}
                    >
                        <div className={styles.title}>
                            TEST 공지사항입니다.
                        </div>
                        <div className={styles.message}>
                            <div >
                                내용이 궁금하면 클릭해보세요!
                            </div>
                            <div className={styles.date}>
                                2024/12/01
                            </div>
                        </div>
                    </div>
                </div>
                {/*Footer*/}
                <SeniorFooter />
            </div>
        );
    } else if (role ==="ADMIN"){
        return (
            <div className={styles.memberContainer}>
                <SideBar />
                <div className={styles.memberSubContainer}>
                    <div className={styles.secTop}>
                        <p onClick={()=>(navigate("/notice"))}>공지사항</p>
                    </div>
                    <div className={styles.memberSearchbox}>
                        <div 
                            className={styles.memberSearchOptions}
                            onClick={handleToggleDropdown}
                        >
                            &nbsp; {selectOption} &nbsp;
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
                            />
                            &nbsp;
                            <img
                                className={styles.memberSearch}
                                src={search}
                                alt="검색"
                            />
                            &nbsp;
                        </div>
                        <div>
                            <button className={styles.memberSearchButton} onClick={()=>(navigate("/noticewrite"))}>공지사항 등록</button>
                        </div>
                    </div>
                    <div className={styles.tableDiv}>
                        <table className={styles.memberNoticeTable}>
                            <thead>
                                <tr>
                                    <th className={styles.thNo}>No</th>
                                    <th className={styles.thTitle}>제목</th>
                                    <th className={styles.thDate}>등록일</th>
                                    <th className={styles.thViews}>조회수</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                    <div className={styles.noticePaging}>
                        <Paging/>
                    </div>
                </div>
            </div>
        );
    }


}
export default NoticeList;